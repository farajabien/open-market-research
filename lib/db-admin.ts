import { init } from "@instantdb/admin";
import schema from "../instant.schema";

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID;
const ADMIN_TOKEN = process.env.INSTANT_APP_ADMIN_TOKEN;

if (!APP_ID) {
  throw new Error("NEXT_PUBLIC_INSTANT_APP_ID is not defined");
}

if (!ADMIN_TOKEN) {
  throw new Error("INSTANT_APP_ADMIN_TOKEN is not defined");
}

export const db = init({
  appId: APP_ID,
  adminToken: ADMIN_TOKEN,
  schema,
});
