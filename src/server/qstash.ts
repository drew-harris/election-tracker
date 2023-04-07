import { Client } from "@upstash/qstash";
import { env } from "~/env.mjs";

const client = new Client({
  token: env.QSTASH_TOKEN,
});

export default client;
