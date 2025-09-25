"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { db } from "@/lib/db";
import { allRoutes } from "@/lib/auth/routes";

function AuthenticatedRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirect") || allRoutes.STUDIES;

  useEffect(() => {
    // User is authenticated, redirect them away from login page
    router.push(redirectTo);
  }, [router, redirectTo]);

  return null;
}

export default function AuthRedirect() {
  return (
    <>
      <db.SignedIn>
        <AuthenticatedRedirect />
      </db.SignedIn>
      <db.SignedOut>
        <div />
      </db.SignedOut>
    </>
  );
}
