
export function getApiBaseUrl(): string {
  const isServer = typeof window === "undefined";
  const apiUrl = process.env.API_URL;
  const publicUrl = process.env.NEXT_PUBLIC_API_URL;

  if (isServer) {
    // Inside Docker, we MUST use the internal service name
    const finalUrl = apiUrl || "http://doc-analyzer-api:3000";
    return finalUrl;
  }

  // Client-side fallback
  return publicUrl || "http://localhost:3001";
}
