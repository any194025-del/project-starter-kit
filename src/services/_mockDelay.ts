/** Simulate network latency so we exercise loading states in the UI. */
export function mockDelay<T>(value: T, ms = 220): Promise<T> {
  return new Promise((resolve) => setTimeout(() => resolve(value), ms));
}

export class ServiceError extends Error {
  constructor(
    public code: "not_found" | "expired" | "forbidden" | "unknown",
    message: string,
  ) {
    super(message);
    this.name = "ServiceError";
  }
}
