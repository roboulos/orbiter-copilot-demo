"use client";

import { useState, useEffect, useCallback } from "react";
import { useThreadActions, useThreadState } from "@crayonai/react-core";
import { QuestionCard } from "./QuestionCard";
import { ScanningCard } from "./ScanningCard";
import { ProgressTracker } from "./ProgressTracker";
import { BackButton } from "./BackButton";

interface InterviewStep {
  id: string;
  question: string;
  type: "question_card" | "scanning";
  data?: unknown;
}

interface InterviewFlowProps {
  topic: string;  // "costa-rica", "investor-intro", etc.
  onComplete: (answers: Record<string, string>) => void;
  allowBack?: boolean;
}

export function InterviewFlow({ topic, onComplete, allowBack = true }: InterviewFlowProps) {
  const { appendMessages, processMessage, deleteMessage, updateMessage } = useThreadActions();
  const { isRunning, messages, error } = useThreadState();
  
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [messageHistory, setMessageHistory] = useState<string[]>([]);

  // Define interview steps based on topic
  const getInterviewSteps = (topic: string): InterviewStep[] => {
    if (topic === "costa-rica") {
      return [
        {
          id: "region",
          question: "Which region interests you?",
          type: "question_card",
          data: {
            icon: "🏝️",
            title: "Costa Rica Relocation",
            description: "Let's find your perfect region",
            buttons: [
              { label: "Pacific Coast", value: "pacific", emoji: "🏖️", subtitle: "Guanacaste, Manuel Antonio" },
              { label: "Central Valley", value: "central", emoji: "🏔️", subtitle: "San José, Escazú" },
              { label: "Caribbean Coast", value: "caribbean", emoji: "🌴", subtitle: "Puerto Viejo, Limón" },
              { label: "Still exploring", value: "exploring", emoji: "🗺️" },
            ]
          }
        },
        {
          id: "scanning",
          question: "",
          type: "scanning",
          data: {
            title: "🔍 Scanning Your Network...",
            status: "Finding connections in your region..."
          }
        },
        {
          id: "purpose",
          question: "What's your main purpose?",
          type: "question_card",
          data: {
            icon: "🏠",
            title: "Investment Purpose",
            description: "Tell us what you're planning",
            buttons: [
              { label: "Vacation Property", value: "vacation", emoji: "🏝️" },
              { label: "Investment Rental", value: "investment", emoji: "💰" },
              { label: "Full Relocation", value: "relocate", emoji: "🎯" },
              { label: "Exploring Options", value: "exploring", emoji: "🤔" },
            ]
          }
        },
        {
          id: "budget",
          question: "What's your budget range?",
          type: "question_card",
          data: {
            icon: "💰",
            title: "Budget Range",
            buttons: [
              { label: "$200-300K", value: "low", emoji: "💵" },
              { label: "$300-500K", value: "mid", emoji: "💰" },
              { label: "$500K+", value: "high", emoji: "💎" },
              { label: "Still researching", value: "unsure", emoji: "🤔" },
            ]
          }
        },
        {
          id: "connections",
          question: "Do you have existing connections in Costa Rica?",
          type: "question_card",
          data: {
            icon: "🤝",
            title: "Existing Connections",
            buttons: [
              { label: "Yes, show them", value: "yes", emoji: "✓" },
              { label: "No, find some", value: "no", emoji: "🔍" },
              { label: "Not sure", value: "unsure", emoji: "🤔" },
            ]
          }
        },
      ];
    }
    
    // Default flow for other topics
    return [];
  };

  const steps = getInterviewSteps(topic);

  const handleAnswer = async (stepId: string, value: string, label: string) => {
    // Record answer
    const newAnswers = { ...answers, [stepId]: value };
    setAnswers(newAnswers);

    // Add user message
    const userMessageId = crypto.randomUUID();
    appendMessages({
      id: userMessageId,
      role: "user",
      type: "prompt",
      message: label,
    });
    setMessageHistory(prev => [...prev, userMessageId]);

    // Move to next step
    const nextStepIndex = currentStep + 1;
    
    if (nextStepIndex >= steps.length) {
      // Interview complete
      onComplete(newAnswers);
    } else {
      setCurrentStep(nextStepIndex);
      
      // Show next step
      const nextStep = steps[nextStepIndex];
      
      if (nextStep.type === "scanning") {
        // Show scanning card
        const scanMessageId = crypto.randomUUID();
        appendMessages({
          id: scanMessageId,
          role: "assistant",
          message: [{
            type: "template",
            name: "scanning_card",
            templateProps: nextStep.data
          }],
        });
        setMessageHistory(prev => [...prev, scanMessageId]);
        
        // Auto-advance after 2 seconds
        setTimeout(() => {
          setCurrentStep(nextStepIndex + 1);
        }, 2000);
      } else {
        // Show next question
        const questionMessageId = crypto.randomUUID();
        appendMessages({
          id: questionMessageId,
          role: "assistant",
          message: [{
            type: "template",
            name: "question_card",
            templateProps: nextStep.data
          }],
        });
        setMessageHistory(prev => [...prev, questionMessageId]);
      }
    }
  };

  // Initialize first question
  useEffect(() => {
    if (steps.length > 0 && messages.length === 0) {
      const firstStep = steps[0];
      const firstMessageId = crypto.randomUUID();
      appendMessages({
        id: firstMessageId,
        role: "assistant",
        message: [{
          type: "template",
          name: "question_card",
          templateProps: firstStep.data
        }],
      });
      setMessageHistory([firstMessageId]);
    }
  }, [steps, messages.length, appendMessages]);

  // Back navigation
  const goBack = useCallback(() => {
    if (currentStep === 0) return;
    
    // Go to previous question step (skip scanning steps)
    let prevStep = currentStep - 1;
    while (prevStep >= 0 && steps[prevStep].type === "scanning") {
      prevStep--;
    }
    
    if (prevStep >= 0) {
      // Remove last answer
      const stepToRemove = steps[currentStep];
      const newAnswers = { ...answers };
      delete newAnswers[stepToRemove.id];
      setAnswers(newAnswers);
      
      // Remove last messages (user message and AI response)
      const lastMessages = messageHistory.slice(-2);
      lastMessages.forEach(msgId => deleteMessage(msgId));
      setMessageHistory(prev => prev.slice(0, -2));
      
      setCurrentStep(prevStep);
    }
  }, [currentStep, steps, answers, messageHistory, deleteMessage]);

  // Progress indicator
  const totalQuestions = steps.filter(s => s.type === "question_card").length;
  const answeredQuestions = Object.keys(answers).length;
  const stepLabels = steps
    .filter(s => s.type === "question_card")
    .map(s => s.id.charAt(0).toUpperCase() + s.id.slice(1));

  return (
    <>
      {/* Progress tracker */}
      <ProgressTracker
        currentStep={answeredQuestions}
        totalSteps={totalQuestions}
        stepLabels={stepLabels}
      />

      {/* Back button (if not first step) */}
      {allowBack && currentStep > 0 && (
        <div style={{ padding: "12px 20px" }}>
          <BackButton onClick={goBack} disabled={isRunning} />
        </div>
      )}

      {/* Status indicator (fixed bottom right) */}
      <div style={{
      position: "fixed",
      bottom: 20,
      right: 20,
      background: "rgba(0,0,0,0.8)",
      backdropFilter: "blur(10px)",
      padding: "12px 20px",
      borderRadius: "12px",
      border: "1px solid rgba(255,255,255,0.1)",
      color: "white",
      fontSize: "13px",
      fontFamily: "Inter, sans-serif",
      zIndex: 1000,
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
        {/* Progress bar */}
        <div style={{ flex: 1, maxWidth: "120px" }}>
          <div style={{
            background: "rgba(255,255,255,0.1)",
            height: "4px",
            borderRadius: "2px",
            overflow: "hidden",
          }}>
            <div style={{
              background: "linear-gradient(90deg, #6366f1, #8b5cf6)",
              height: "100%",
              width: `${(answeredQuestions / totalQuestions) * 100}%`,
              transition: "width 0.3s ease",
            }} />
          </div>
        </div>
        
        {/* Text */}
        <div style={{ fontSize: "11px", color: "rgba(255,255,255,0.6)", whiteSpace: "nowrap" }}>
          Step {answeredQuestions} of {totalQuestions}
        </div>

        {/* Loading indicator */}
        {isRunning && (
          <div style={{
            width: "6px",
            height: "6px",
            borderRadius: "50%",
            background: "#6366f1",
            animation: "pulse 1.5s ease-in-out infinite",
          }} />
        )}

        {/* Error indicator */}
        {error && (
          <div style={{ color: "#ef4444", fontSize: "11px" }}>
            Error
          </div>
        )}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(1.2); }
        }
      `}</style>
    </div>
    </>
  );
}
