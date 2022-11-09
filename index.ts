import "dotenv/config";
import { broadcastCalls } from "./services/broadcastCalls.js";
import { callAppBigBoxes, callAppManyBoxes } from "./services/callApp.js";
import { createApp } from "./services/createApp.js";

process.on("uncaughtException", (err) => err instanceof Error && console.log(err.message));
process.on("unhandledRejection", (err) => err instanceof Error && console.log(err.message));

const arg = process.argv[2];

try {
  if (arg === "create") {
    await createApp();
    process.exit(0);
  }
  const signedTxs: Uint8Array[][] = [];
  for (let i = 0; i < 100; i++) {
    signedTxs.push(callAppBigBoxes(10, 24), callAppManyBoxes(7500, 240));
  }
  await broadcastCalls(signedTxs);
} catch (error) {
  error instanceof Error && console.log(error.message);
}
