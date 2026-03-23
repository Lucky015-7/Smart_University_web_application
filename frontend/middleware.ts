import { auth0 } from "@/lib/auth0";

export async function middleware(request: Request) {
  return await auth0.middleware(request);
}

// This tells Next.js to run Auth0 on all routes EXCEPT static files/images
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)"
  ],
};