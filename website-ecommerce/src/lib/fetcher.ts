import { z } from "zod";

export class HttpError extends Error {
  status: number;
  payload?: unknown;
  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.status = status;
    this.payload = payload;
  }
}

// Overloads so TS knows the return type when a schema is provided
export async function apiFetch<T = unknown>(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<T>;

export async function apiFetch<TSchema extends z.ZodTypeAny>(
  input: RequestInfo | URL,
  init: RequestInit & { schema: TSchema }
): Promise<z.infer<TSchema>>;

export async function apiFetch(
  input: RequestInfo | URL,
  init: RequestInit & { schema?: z.ZodTypeAny } = {}
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);

  try {
    const res = await fetch(input, {
      ...init,
      headers: { "Content-Type": "application/json", ...(init.headers || {}) },
      signal: controller.signal,
      credentials: "include",
    });

    const text = await res.text();
    const data = text ? JSON.parse(text) : null;

    if (!res.ok) throw new HttpError(data?.message || res.statusText, res.status, data);

    // ✅ If a schema is passed, parse & return the typed result
    if (init.schema) return init.schema.parse(data);

    return data;
  } catch (err: any) {
    if (err?.name === "AbortError") throw new HttpError("Request timed out", 408);
    if (err instanceof HttpError) throw err;
    throw new HttpError(err?.message || "Network error", 520);
  } finally {
    clearTimeout(timeout);
  }
}
