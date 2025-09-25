// Route configuration for authentication and navigation

export const publicRoutes = ["/", "/studies"] as const;

export const protectedRoutes = ["/submit", "/my-submissions"] as const;

// All routes for easy reference
export const allRoutes = {
  HOME: "/",
  STUDIES: "/studies",
  SUBMIT: "/submit",
  MY_SUBMISSIONS: "/my-submissions",
  LOGIN: "/login",
} as const;

export type PublicRoute = (typeof publicRoutes)[number];
export type ProtectedRoute = (typeof protectedRoutes)[number];
export type Route = (typeof allRoutes)[keyof typeof allRoutes];

export function isPublicRoute(pathname: string): boolean {
  return publicRoutes.some((route) => pathname.startsWith(route));
}

export function isProtectedRoute(pathname: string): boolean {
  return protectedRoutes.some((route) => pathname.startsWith(route));
}
