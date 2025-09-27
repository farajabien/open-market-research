"use client";

import { useAuth } from "@/lib/contexts/auth-context";
import Header from "./header";

export default function HeaderWrapper() {
  const { user, isLoading } = useAuth();

  // Show loading state while auth is being determined
  if (isLoading) {
    return <Header user={null} />;
  }

  return <Header user={user} />;
}
