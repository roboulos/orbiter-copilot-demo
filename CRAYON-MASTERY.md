# Crayon Mastery - Using the Full API Properly

## The Problem

We were trying to hack Crayon with:
- DOM manipulation (`textarea.value = x; button.click()`)
- Custom events as workarounds
- Guessing at how things work

**This is wrong.** Crayon has a complete programmatic API through `threadManager`.

## The Right Way - ThreadManager API

### What Crayon Gives Us

```typescript
type ThreadManager = {
  // STATE
  isRunning?: boolean;
  isLoadingMessages: boolean;
  messages: Message[];
  error: Error | null;
  responseTemplates: Record<string, ResponseTemplate>;
  isInitialized: boolean;

  // ACTIONS
  processMessage: (message: CreateMessage) => Promise<void>;
  appendMessages: (...messages: Message[]) => void;
  updateMessage: (message: Message) => void;
  onCancel: () => void;
  setMessages: (messages: Message[]) => void;
  deleteMessage: (messageId: string) => void;
};
```

### How to Use It

**Option 1: Use the built-in `useThreadManager` hook**
```typescript
import { useThreadManager } from "@crayonai/react-core";

const threadManager = useThreadManager({
  processMessage: async ({ threadId, messages, abortController }) => {
    // Your backend call
    return fetch("/chat", { ... });
  },
  responseTemplates: templates,
});

// Pass to CrayonChat
<CrayonChat threadManager={threadManager} />
```

**Option 2: Access threadManager from inside CrayonChat context**
```typescript
import { useThreadActions, useThreadState } from "@crayonai/react-core";

function MyTemplate() {
  const actions = useThreadActions(); // appendMessages, processMessage, etc.
  const state = useThreadState();     // messages, isRunning, etc.

  const handleButtonClick = async (value: string) => {
    // 1. Add user message
    actions.appendMessages({
      id: crypto.randomUUID(),
      role: "user",
      message: value,
      createdAt: new Date(),
    });

    // 2. Trigger AI response
    await actions.processMessage({ message: value });
  };
}
```

## The Correct Architecture

### Before (Hacky)
```typescript
// ButtonGroup component
const handleClick = (value: string) => {
  // Try to hack the DOM
  const textarea = document.querySelector('textarea');
  textarea.value = value;
  document.querySelector('button').click(); // Doesn't work!
};
```

### After (Proper)
```typescript
// ButtonGroup component using Crayon API
import { useThreadActions } from "@crayonai/react-core";

const handleClick = async (value: string) => {
  const { appendMessages, processMessage } = useThreadActions();
  
  // Add user's selection as a message
  appendMessages({
    id: crypto.randomUUID(),
    role: "user",
    message: value,
    createdAt: new Date(),
  });
  
  // Trigger AI to respond
  await processMessage({ message: value });
};
```

## What This Unlocks

### 1. Programmatic Message Control
```typescript
// Add any message at any time
actions.appendMessages({
  role: "agent",
  message: { template: "scanning_card", data: { ... } },
});

// Modify existing messages
actions.updateMessage({
  id: messageId,
  role: "agent",
  message: "Updated content",
});

// Clear all messages
actions.setMessages([]);
```

### 2. Multi-Step Flows
```typescript
// Step 1: Show question
actions.appendMessages({
  role: "agent",
  message: {
    template: "question_card",
    data: { title: "Region?", buttons: [...] }
  }
});

// Step 2: User clicks button → we intercept
const handleButtonClick = async (value: string) => {
  // Add user answer
  actions.appendMessages({
    role: "user",
    message: value,
  });
  
  // Show loading state
  actions.appendMessages({
    role: "agent",
    message: { template: "scanning_card", data: { ... } }
  });
  
  // Get AI response
  await actions.processMessage({ message: value });
};
```

### 3. Client-Side Intelligence
```typescript
// We can handle some logic client-side
const handleSubmit = async () => {
  // 1. Show scanning card immediately (no backend call)
  actions.appendMessages({
    role: "agent",
    message: { template: "scanning_card", data: { matches_found: 0 } }
  });
  
  // 2. Call backend
  const matches = await fetch("/analyze-network");
  
  // 3. Update scanning card with results
  actions.updateMessage({
    id: scanningMessageId,
    message: { template: "scanning_card", data: { matches_found: matches.length } }
  });
  
  // 4. Show final results
  actions.appendMessages({
    role: "agent",
    message: { template: "contact_card", data: matches[0] }
  });
};
```

### 4. Progressive Disclosure
```typescript
// Show buttons one question at a time
const interview = [
  { question: "Region?", buttons: [...] },
  { question: "Purpose?", buttons: [...] },
  { question: "Budget?", buttons: [...] },
];

let currentStep = 0;

const handleAnswer = async (value: string) => {
  // Record answer
  actions.appendMessages({ role: "user", message: value });
  
  // Next question
  currentStep++;
  if (currentStep < interview.length) {
    actions.appendMessages({
      role: "agent",
      message: {
        template: "question_card",
        data: interview[currentStep]
      }
    });
  } else {
    // Interview complete → show summary
    actions.appendMessages({
      role: "agent",
      message: { template: "outcome_card", data: { ... } }
    });
  }
};
```

## Message Format

### User Messages
```typescript
{
  id: string;
  role: "user";
  message: string;
  createdAt: Date;
}
```

### Agent Messages (Plain Text)
```typescript
{
  id: string;
  role: "agent";
  message: string;
  createdAt: Date;
}
```

### Agent Messages (Template)
```typescript
{
  id: string;
  role: "agent";
  message: {
    template: "question_card";
    data: {
      icon: "🏝️";
      title: "Region?";
      buttons: [...]
    }
  };
  createdAt: Date;
}
```

## Full Example: Button Interview Flow

```typescript
import { useThreadActions } from "@crayonai/react-core";

export function QuestionCard({ icon, title, buttons }) {
  const { appendMessages, processMessage } = useThreadActions();
  const [selected, setSelected] = useState(null);

  const handleButtonClick = async (button) => {
    setSelected(button.value);
    
    // 1. Add user's selection to thread
    appendMessages({
      id: crypto.randomUUID(),
      role: "user",
      message: button.label,
      createdAt: new Date(),
    });
    
    // 2. Request next AI response
    await processMessage({ message: button.value });
    
    // AI will return next question_card or final outcome
  };

  return (
    <div className="question-card">
      <div className="icon">{icon}</div>
      <h3>{title}</h3>
      {buttons.map(btn => (
        <button
          key={btn.value}
          onClick={() => handleButtonClick(btn)}
          disabled={selected && selected !== btn.value}
        >
          {btn.emoji} {btn.label}
          {selected === btn.value && <span>✓</span>}
        </button>
      ))}
    </div>
  );
}
```

## Crayon Hooks Reference

### From `@crayonai/react-core`

```typescript
import {
  useThreadActions,   // appendMessages, processMessage, updateMessage, etc.
  useThreadState,     // messages, isRunning, error, etc.
  useThreadManager,   // Full manager (state + actions combined)
  useMessage,         // Access current message context
} from "@crayonai/react-core";
```

### `useThreadActions`
```typescript
const {
  processMessage,    // Trigger AI response
  appendMessages,    // Add messages to thread
  updateMessage,     // Modify existing message
  onCancel,          // Cancel current processing
  setMessages,       // Replace all messages
  deleteMessage,     // Remove a message
} = useThreadActions();
```

### `useThreadState`
```typescript
const {
  isRunning,         // Is AI currently processing?
  messages,          // All messages in thread
  error,             // Last error if any
  responseTemplates, // Available templates
  isInitialized,     // Is thread ready?
} = useThreadState();
```

## Next Steps

1. **Refactor ButtonGroup** to use `useThreadActions`
2. **Remove all custom events** and DOM hacks
3. **Use `appendMessages` + `processMessage`** for flow control
4. **Test with Crayon's actual API** instead of guessing

This is the RIGHT way to use Crayon. No more hacks.
