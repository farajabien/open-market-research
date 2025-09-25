"use client";

import { db } from "@/lib/db";
import Header from "./header";

export default function HeaderWrapper() {
  return (
    <>
      <db.SignedIn>
        <HeaderWithUser />
      </db.SignedIn>
      <db.SignedOut>
        <HeaderWithoutUser />
      </db.SignedOut>
    </>
  );
}

function HeaderWithUser() {
  const user = db.useUser();
  return <Header user={user} />;
}

function HeaderWithoutUser() {
  return <Header user={null} />;
}
