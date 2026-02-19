# Network Access Fix - Options

## Problem Summary
Backend AI responds "I can't see through your contacts network" when user asks network-related questions without selecting a specific person.

## Option 1: Backend Flag (RECOMMENDED)

**Add `include_network: true` flag to /chat endpoint**

```typescript
// In page.tsx processMessage:
const data = await chat(
  prompt,
  personContextRef.current || undefined,
  history.length > 0 ? history : undefined,
  masterPersonIdRef.current,
  true  // ← NEW: include_network flag
);

// In xano.ts:
export async function chat(
  prompt: string,
  personContext?: string,
  history?: Array<{ role: string; content: string }>,
  masterPersonId?: number,
  includeNetwork?: boolean  // ← NEW
) {
  return xanoFetch<{ raw: string; model: string }>("/chat", {
    method: "POST",
    body: {
      prompt,
      ...(personContext ? { person_context: personContext } : {}),
      ...(masterPersonId ? { master_person_id: masterPersonId } : {}),
      ...(history?.length ? { history } : {}),
      ...(includeNetwork ? { include_network_access: true } : {}),  // ← NEW
    },
  });
}
```

**Backend Implementation:**
- When `include_network_access: true`, backend loads user's network connections
- Adds network summary to system prompt
- AI can now answer network questions

**Pros:**
- Clean, simple
- Backend controls what network data to expose
- No extra frontend API calls

**Cons:**
- Requires backend change
- Depends on backend team timeline

---

## Option 2: Pre-fetch Network Summary (IMMEDIATE)

**Fetch network summary on copilot open, include in context**

```typescript
// In page.tsx:
const [networkSummary, setNetworkSummary] = useState<string>("");

useEffect(() => {
  if (modalOpen && !networkSummary) {
    // Fetch network summary once when copilot opens
    getNetwork({ per_page: 100 }).then(data => {
      const summary = `My Network (${data.items.length} connections):\n` +
        data.items.slice(0, 20).map(p => 
          `- ${p.full_name}${p.master_person?.current_title ? ` (${p.master_person.current_title})` : ''}`
        ).join('\n');
      setNetworkSummary(summary);
    });
  }
}, [modalOpen, networkSummary]);

// In processMessage:
const data = await chat(
  prompt,
  [
    networkSummary,  // ← Network summary
    personContextRef.current
  ].filter(Boolean).join('\n\n'),  // Combine contexts
  history,
  masterPersonIdRef.current
);
```

**Pros:**
- Works immediately (no backend changes)
- Gives AI actual network data
- Can be implemented in 5 minutes

**Cons:**
- Extra API call on copilot open
- Limited to first 20-100 connections
- Increases context size

---

## Option 3: Dynamic Network Queries (ADVANCED)

**Create a custom template that fetches network data on demand**

```typescript
// New component: NetworkQueryCard.tsx
export function NetworkQueryCard({ query }: { query: string }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Backend returns: "Let me search your network for X..."
    // Then queries network API
    // Returns results as a card
  }, [query]);

  return <div>...</div>;
}
```

**Pros:**
- Most flexible
- Can handle complex network queries
- No context bloat

**Cons:**
- Most complex to implement
- Requires backend coordination
- Overkill for current needs

---

## Recommendation: Option 2 First, Then Option 1

**Immediate (10 minutes):**
1. Implement Option 2 (pre-fetch network summary)
2. Test if AI can now answer network questions
3. Measure context size impact

**Short-term (next sprint):**
4. Work with backend team on Option 1 (proper network access flag)
5. Remove Option 2 once Option 1 is live

**Implementation Order:**
1. ✅ Test Option 2 works
2. ✅ Verify AI answers improve
3. ✅ Coordinate with backend for Option 1
4. ✅ Migrate to Option 1
5. ✅ Remove temporary Option 2 code

---

## Quick Test

**To test if network summary helps:**

```typescript
// Temporarily hardcode a summary:
const networkSummary = `My Network (5 sample connections):
- Sarah Chen (VP Engineering at Stripe)
- Marcus Williams (Seed Investor at Sequoia)
- Jessica Rodriguez (Head of Product at Notion)
- David Park (Real Estate Developer in Costa Rica)
- Emily Foster (Fractional CFO)`;

// Pass to chat as person_context
```

**Ask:** "Who in my network knows about Costa Rica?"

**Expected:** AI should mention David Park

If this works → Option 2 is viable → Implement properly
If this doesn't work → Backend needs deeper changes → Escalate

---

## Next Steps

**RIGHT NOW:**
1. Test button fix (CRITICAL-ISSUES.md)
2. If buttons work, test Option 2 hardcoded summary
3. Report results

**THIS WEEKEND:**
- Implement Option 2 properly if hardcode test works
- Full flow testing
- Backend coordination for Option 1

**GOAL:** Working network-aware AI by end of weekend
