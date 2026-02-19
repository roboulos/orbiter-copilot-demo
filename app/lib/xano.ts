const API_URL = process.env.NEXT_PUBLIC_XANO_API_URL!;
const USER_ID = Number(process.env.NEXT_PUBLIC_XANO_USER_ID!);

let cachedToken: string | null = null;

export async function getAuthToken(): Promise<string> {
  if (cachedToken) return cachedToken;

  const res = await fetch(`${API_URL}/dev-token`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ user_id: USER_ID }),
  });

  if (!res.ok) throw new Error(`Auth failed: ${res.statusText}`);
  const data = await res.json();
  cachedToken = data.authToken;
  return cachedToken!;
}

export async function xanoFetch<T = unknown>(
  path: string,
  options: {
    method?: string;
    body?: unknown;
    params?: Record<string, string>;
  } = {}
): Promise<T> {
  const token = await getAuthToken();
  const { method = "GET", body, params } = options;

  let url = `${API_URL}${path}`;
  if (params) {
    const qs = new URLSearchParams(params).toString();
    url += `?${qs}`;
  }

  const res = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    ...(body ? { body: JSON.stringify(body) } : {}),
  });

  if (res.status === 401) {
    // Token expired, clear and retry once
    cachedToken = null;
    const newToken = await getAuthToken();
    const retry = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${newToken}`,
      },
      ...(body ? { body: JSON.stringify(body) } : {}),
    });
    if (!retry.ok) throw new Error(`Xano error: ${retry.statusText}`);
    return retry.json();
  }

  if (!res.ok) throw new Error(`Xano error: ${res.statusText}`);
  return res.json();
}

// Typed API helpers

// ── Semantic Search ──────────────────────────────────────

export interface SearchPerson {
  master_person_id: number;
  full_name: string;
  in_my_network: boolean;
  master_person: {
    id: number;
    name: string;
    avatar: string | null;
    current_title: string | null;
    bio: string | null;
    master_company: { id: number; company_name: string; logo: string | null } | null;
  } | null;
}

export async function searchPersons(q: string, mode: "network" | "universe" = "network", limit = 20) {
  try {
    return await xanoFetch<{ items: SearchPerson[] }>("/search", {
      params: { q, mode, limit: String(limit) },
    });
  } catch {
    // Fallback to /person-search if /search endpoint doesn't exist
    try {
      const data = await xanoFetch<{ items: Array<{
        master_person_id: number;
        full_name: string;
        current_title?: string | null;
        bio?: string | null;
        master_company?: { id: number; company_name: string; logo: string | null } | null;
      }> }>("/person-search", { params: { query: q, limit: String(limit) } });
      return {
        items: (data.items || []).map((p) => ({
          master_person_id: p.master_person_id,
          full_name: p.full_name,
          in_my_network: true,
          master_person: {
            id: p.master_person_id,
            name: p.full_name,
            avatar: null,
            current_title: p.current_title || null,
            bio: p.bio || null,
            master_company: p.master_company || null,
          },
        })) as SearchPerson[],
      };
    } catch {
      return { items: [] as SearchPerson[] };
    }
  }
}

// ── Connection Path ──────────────────────────────────────

export interface ConnectionHop {
  name: string;
  title: string | null;
  company: string | null;
  relationship: "connected" | "in_network";
  master_person_id: number;
  avatar: string | null;
}

export interface ConnectionPath {
  target: { name: string; title: string | null; avatar: string | null; master_person_id: number };
  hops: ConnectionHop[];
  hop_count: number;
  in_network: boolean;
}

export async function getConnectionPath(target_master_person_id: number) {
  return xanoFetch<ConnectionPath>("/connection-path", {
    params: { target_master_person_id: String(target_master_person_id) },
  });
}

// ── Collections ──────────────────────────────────────────

export interface Collection {
  id: number;
  name: string;
  description: string | null;
  color: string;
  created_at: number;
  member_count: number;
}

export interface CollectionMember {
  collection_node_id: number;
  master_person_id: number;
  name: string;
  avatar: string | null;
  current_title: string | null;
  company_name: string | null;
  added_at: number;
}

export interface CollectionDetail extends Collection {
  members: CollectionMember[];
}

export async function getCollections(opts: { page?: number; per_page?: number } = {}) {
  const params: Record<string, string> = {};
  if (opts.page) params.page = String(opts.page);
  if (opts.per_page) params.per_page = String(opts.per_page);
  return xanoFetch<{ items: Collection[]; total: number }>("/collections", { params });
}

export async function createCollection(data: { name: string; description?: string; color?: string }) {
  return xanoFetch<Collection>("/collection", { method: "POST", body: data });
}

export async function getCollection(id: number) {
  return xanoFetch<CollectionDetail>(`/collection/${id}`);
}

export async function addCollectionMember(collectionId: number, master_person_id: number) {
  return xanoFetch<{ success: boolean; collection_node_id: number }>(
    `/collection/${collectionId}/member`,
    { method: "POST", body: { master_person_id } }
  );
}

export async function removeCollectionMember(collectionId: number, master_person_id: number) {
  return xanoFetch<{ success: boolean }>(
    `/collection/${collectionId}/member/${master_person_id}`,
    { method: "DELETE", body: {} }
  );
}

export async function getPersonContext(masterPersonId: number): Promise<string> {
  const data = await xanoFetch<string>(`/person-context/${masterPersonId}`);
  return typeof data === "string" ? data : JSON.stringify(data);
}

/**
 * System prompt additions for the Xano /chat endpoint.
 *
 * ─── meeting_prep_card ───────────────────────────────────────────────────────
 * TRIGGER phrases: "meeting with", "prep for", "prepare for", "before I meet",
 *                  "meeting prep", "prepare me for a meeting", "get me ready for"
 *
 * When triggered, respond with a card named "meeting_prep_card" with this schema:
 * {
 *   "name": "meeting_prep_card",
 *   "templateProps": {
 *     "personName": string,            // Full name of the person
 *     "personTitle": string?,          // Their current job title
 *     "personCompany": string?,        // Their company
 *     "summary": string,               // 2-3 sentence overview of who they are
 *     "talkingPoints": [               // 2-4 talking points
 *       {
 *         "topic": string,             // Short topic label
 *         "opener": string,            // Suggested conversation opener
 *         "whyTheyCare": string        // Why this matters to them
 *       }
 *     ],
 *     "listenFor": string[],           // 2-4 things to listen for
 *     "landmines": string[],           // 2-3 topics to avoid
 *     "sharedContext": string?         // What you have in common (optional)
 *   }
 * }
 *
 * ─── All other card types follow the same response format: ─────────────────
 * { "response": [ { "name": "card_name", "templateProps": { ... } } ] }
 * ──────────────────────────────────────────────────────────────────────────────
 */
export async function chat(
  prompt: string,
  personContext?: string,
  history?: Array<{ role: string; content: string }>,
  masterPersonId?: number
) {
  return xanoFetch<{ raw: string; model: string }>("/chat", {
    method: "POST",
    body: {
      prompt,
      ...(personContext ? { person_context: personContext } : {}),
      ...(masterPersonId ? { master_person_id: masterPersonId } : {}),
      ...(history?.length ? { history } : {}),
    },
  });
}

export async function createLeverageLoop(data: {
  master_person_id: number;
  request_panel_title: string;
  request_context: string;
}) {
  return xanoFetch<{ id: number; status: string }>("/leverage-loop", {
    method: "POST",
    body: data,
  });
}

export async function dispatchLeverageLoop(id: number) {
  return xanoFetch<{
    success: boolean;
    message: string;
    loop: unknown;
    dispatch_payload: unknown;
  }>(`/leverage-loop/${id}/dispatch`, {
    method: "PATCH",
    body: {},
  });
}

// ── Network ──────────────────────────────────────────────

export interface NetworkPerson {
  id: number;
  master_person_id: number;
  full_name: string;
  status_connected: string;
  last_activity_at: number | null;
  keep_in_touch: number | null;
  node_uuid: string | null;
  master_person: {
    id: number;
    name: string;
    avatar: string | null;
    master_company_id: number | null;
    current_title: string | null;
    bio: string | null;
    master_company?: { id: number; company_name: string; logo: string | null } | null;
  } | null;
}

export interface PaginatedResponse<T> {
  itemsReceived: number;
  curPage: number;
  nextPage: number | null;
  prevPage: number | null;
  itemsTotal: number;
  pageTotal: number;
  items: T[];
}

export async function getNetwork(opts: { query?: string; page?: number; per_page?: number } = {}) {
  const params: Record<string, string> = {};
  if (opts.query) params.query = opts.query;
  if (opts.page) params.page = String(opts.page);
  if (opts.per_page) params.per_page = String(opts.per_page);
  return xanoFetch<PaginatedResponse<NetworkPerson>>("/network", { params });
}

// ── Outcomes / Suggestion Requests ───────────────────────

export interface OutcomeItem {
  id: number;
  created_at: number;
  updated_at: number | null;
  copilot_mode: "outcome" | "loop" | "serendipity";
  request_panel_title: string;
  request_header_title: string | null;
  request_context: string | null;
  master_person_id: number | null;
  status: "draft" | "processing" | "suggestion" | "submitted" | "archived";
  master_person: {
    id: number;
    name: string;
    avatar: string | null;
    current_title: string | null;
    master_company?: { id: number; company_name: string; logo: string | null } | null;
  } | null;
}

export async function getOutcomes(opts: { copilot_mode?: string; query?: string; page?: number; per_page?: number } = {}) {
  const params: Record<string, string> = {};
  if (opts.copilot_mode) params.copilot_mode = opts.copilot_mode;
  if (opts.query) params.query = opts.query;
  if (opts.page) params.page = String(opts.page);
  if (opts.per_page) params.per_page = String(opts.per_page);
  return xanoFetch<PaginatedResponse<OutcomeItem>>("/outcomes", { params });
}

export async function createOutcome(data: {
  copilot_mode?: string;
  request_panel_title: string;
  request_context?: string;
  master_person_id?: number;
}) {
  return xanoFetch<OutcomeItem>("/outcome", {
    method: "POST",
    body: { copilot_mode: "outcome", ...data },
  });
}

// ── Horizon / Node Targets ───────────────────────────────

export interface HorizonTarget {
  id: number;
  created_at: number;
  node_uuid: string;
  master_person: {
    id: number;
    name: string;
    avatar: string | null;
    master_company_id: number | null;
    current_title: string | null;
    bio: string | null;
    master_company?: { id: number; company_name: string; logo: string | null } | null;
  } | null;
}

export async function getHorizon(opts: { page?: number; per_page?: number } = {}) {
  const params: Record<string, string> = {};
  if (opts.page) params.page = String(opts.page);
  if (opts.per_page) params.per_page = String(opts.per_page);
  return xanoFetch<PaginatedResponse<HorizonTarget>>("/horizon", { params });
}

export async function addHorizonTarget(node_uuid: string) {
  return xanoFetch<HorizonTarget>("/horizon-target", {
    method: "POST",
    body: { node_uuid },
  });
}

export async function addHorizonTargetByPersonId(master_person_id: number) {
  return xanoFetch<HorizonTarget>("/horizon-target-by-person-id", {
    method: "POST",
    body: { master_person_id },
  });
}

export async function removeHorizonTarget(id: number) {
  return xanoFetch(`/horizon-target/${id}`, { method: "DELETE", body: {} });
}

export async function dispatchOutcome(id: number) {
  return xanoFetch<OutcomeItem>(`/outcome/${id}/dispatch`, { method: "PATCH", body: {} });
}

// Dispatch an outcome item — routes to the correct endpoint based on copilot_mode
export async function dispatchOutcomeItem(id: number, mode: string) {
  if (mode === "loop") {
    return xanoFetch<{ success: boolean }>(`/leverage-loop/${id}/dispatch`, { method: "PATCH", body: {} });
  }
  return xanoFetch<OutcomeItem>(`/outcome/${id}`, { method: "PATCH", body: { status: "submitted" } });
}

export async function archiveOutcome(id: number) {
  return xanoFetch<OutcomeItem>(`/outcome/${id}`, { method: "PATCH", body: { status: "archived" } });
}

// ── Dispatch ─────────────────────────────────────────────

export interface DispatchRequest {
  summary: string;
  context: Record<string, unknown>;
  person_id: number | null;
  conversation_history: Array<{ role: string; content: string }>;
}

export interface DispatchResponse {
  success: boolean;
  dispatch_id: string;
  suggestion_request_id: number;
  status: string;
}

export async function dispatch(data: DispatchRequest) {
  return xanoFetch<DispatchResponse>("/dispatch", {
    method: "POST",
    body: data,
  });
}
