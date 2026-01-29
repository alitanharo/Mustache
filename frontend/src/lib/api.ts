export const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

type RequestOptions = {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
};

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.status = status;
    this.details = details;
  }
}

const getToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("mustache_token");
};

export const setToken = (token: string | null) => {
  if (typeof window === "undefined") return;
  if (token) {
    localStorage.setItem("mustache_token", token);
  } else {
    localStorage.removeItem("mustache_token");
  }
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const headers: Record<string, string> = {
    ...(options.headers || {})
  };

  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  let body: BodyInit | undefined;
  if (options.body instanceof FormData) {
    body = options.body;
  } else if (options.body !== undefined) {
    body = JSON.stringify(options.body);
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${API_URL}${path}`, {
    method: options.method || "GET",
    headers,
    body
  });

  const payload = await response.json().catch(() => ({}));

  if (!response.ok) {
    const validationMessage = Array.isArray(payload?.errors) && payload.errors.length > 0
      ? payload.errors[0]?.msg
      : undefined;
    const message =
      payload?.error?.message ||
      payload?.error ||
      payload?.message ||
      validationMessage ||
      "Request failed";
    throw new ApiError(message, response.status, payload?.errors || payload);
  }

  return payload as T;
}