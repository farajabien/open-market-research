// Docs: https://www.instantdb.com/docs/permissions

import type { InstantRules } from "@instantdb/react";

const rules = {
  // Users can view their own profile (read-only)
  $users: {
    allow: {
      view: "auth.id != null",
    },
  },
  
  // Profiles can be viewed and updated by their owner
  profiles: {
    allow: {
      view: "auth.id != null",
      create: "auth.id != null",
      update: "isOwner",
      delete: "isOwner",
    },
    bind: ["isOwner", "auth.id != null && auth.id == data.user"],
  },

  // Studies can be viewed by anyone, but only created/updated by authenticated users
  studies: {
    allow: {
      view: "true", // Public read access
      create: "auth.id != null", // Must be authenticated to create
      update: "isOwner", // Only owner can update
      delete: "isOwner", // Only owner can delete
    },
    bind: ["isOwner", "auth.id != null && auth.id == data.created_by"],
  },

  // Prevent schema changes from client-side
  attrs: {
    allow: {
      $default: "false",
    },
  },
} satisfies InstantRules;

export default rules;
