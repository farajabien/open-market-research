"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import ProfileDialog from "@/components/auth/profile-dialog";
import { allRoutes, protectedRoutes } from "@/lib/auth/routes";

interface HeaderProps {
  user: { id: string; email: string } | null;
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();

  // Check if current route is protected
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex h-14 items-center">
        <div className="mr-4 flex">
          <Link
            href={allRoutes.HOME}
            className="mr-6 flex items-center space-x-2"
          >
            <span className="font-bold text-xl">Open Market Research</span>
          </Link>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <Link
              href={allRoutes.STUDIES}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Browse Studies
            </Link>
            {user && (
              <Link
                href={allRoutes.MY_SUBMISSIONS}
                className="transition-colors hover:text-foreground/80 text-foreground/60"
              >
                My Submissions
              </Link>
            )}
            <Link
              href={allRoutes.SUBMIT}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              Submit Research
            </Link>
          </nav>

          <div className="flex items-center space-x-2">
            {user ? (
              <>
                <ProfileDialog />
                {!isProtectedRoute && (
                  <Button asChild>
                    <Link href={allRoutes.SUBMIT}>Submit Research</Link>
                  </Button>
                )}
              </>
            ) : (
              <Button asChild>
                <Link href={allRoutes.SUBMIT}>Get Started</Link>
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
