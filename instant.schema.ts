// Docs: https://www.instantdb.com/docs/modeling-data

import { i } from "@instantdb/react";

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    profiles: i.entity({
      name: i.string().optional(),
      profile_url: i.string().optional(),
      bio: i.string().optional(),
      company: i.string().optional(),
      role: i.string().optional(),
      created_at: i.string(),
      updated_at: i.string(),
      submission_count: i.number().optional(),
    }),
    studies: i.entity({
      title: i.string(),
      summary: i.string(),
      published_date: i.string(),
      market: i.json(), // { countries: string[], cities: string[] }
      target_audience: i.json(), // string[]
      contributors: i.json(), // Contributor[]
      methodology: i.json(), // Methodology
      top_findings: i.json(), // string[]
      insights: i.json(), // string[]
      links: i.json(), // Links
      license: i.string(),
      tags: i.json(), // string[]
      verification_status: i.string(),
      created_at: i.string().indexed(),
      updated_at: i.string(),
      // created_by already exists in the database
      raw_data: i.string().optional(),
      industry: i.string().optional(),
      company_size: i.string().optional(),
      budget_range: i.string().optional(),
    }),
  },
  links: {
    // Profiles are linked to users
    profileUser: {
      forward: { on: "profiles", has: "one", label: "user" },
      reverse: { on: "$users", has: "one", label: "profile" },
    },
    // Studies are linked to users who created them
    studyAuthor: {
      forward: { on: "studies", has: "one", label: "created_by" },
      reverse: { on: "$users", has: "many", label: "studies" },
    },
  },
  rooms: {},
});

// This helps Typescript display nicer intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;
