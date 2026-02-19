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
export async function searchPersons(query: string, limit = 10) {
  return xanoFetch<{
    itemsReceived: number;
    itemsTotal: number;
    items: Array<{
      id: number;
      master_person_id: number;
      full_name: string;
      status_connected: string;
      master_person: {
        id: number;
        name: string;
        avatar: string | null;
        master_company_id: number | null;
        current_title: string | null;
        master_company?: { company_name: string } | null;
      };
    }>;
  }>("/person-search", { params: { query, limit: String(limit) } });
}

export async function getPersonContext(masterPersonId: number): Promise<string> {
  const data = await xanoFetch<string>(`/person-context/${masterPersonId}`);
  return typeof data === "string" ? data : JSON.stringify(data);
}

export async function chat(
  prompt: string,
  personContext?: string,
  history?: Array<{ role: string; content: string }>
) {
  return xanoFetch<{ raw: string; model: string }>("/chat", {
    method: "POST",
    body: {
      prompt,
      ...(personContext ? { person_context: personContext } : {}),
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
