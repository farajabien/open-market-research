"use client";

import React from "react";
import { AuthProvider as ContextAuthProvider } from "@/lib/contexts/auth-context";

interface AuthProviderProps {
  children: React.ReactNode;
}

export default function AuthProvider({ children }: AuthProviderProps) {
  // Use our enhanced auth context that handles profile management
  return <ContextAuthProvider>{children}</ContextAuthProvider>;
}
