// proxy.ts
import { auth0 } from "@/lib/auth0";

export async function proxy(request: Request) {
  // Use the same auth0 helper, just inside the renamed 'proxy' function
  return await auth0.middleware(request);
}

// The config/matcher stays exactly the same
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ],
};