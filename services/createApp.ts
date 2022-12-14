import {
  makeApplicationCreateTxnFromObject,
  mnemonicToSecretKey,
  OnApplicationComplete,
  waitForConfirmation,
} from "algosdk";
import { algoD, algoParams } from "../constants/constants.js";
import { app } from "../contract/app.teal.js";

export const createApp = async () => {
  const account = mnemonicToSecretKey(process.env.MNEMO!);
  const suggestedParams = await algoParams();

  const compiledApp = (await algoD.compile(app).do()) as { hash: string; result: string };

  const tx = makeApplicationCreateTxnFromObject({
    suggestedParams,
    from: account.addr,
    approvalProgram: new Uint8Array(Buffer.from(compiledApp.result, "base64")),
    clearProgram: new Uint8Array(Buffer.from("CIEB", "base64")),
    numGlobalByteSlices: 0,
    numGlobalInts: 0,
    numLocalByteSlices: 0,
    numLocalInts: 0,
    onComplete: OnApplicationComplete.NoOpOC,
  });

  const txSigned = tx.signTxn(account.sk);
  const { txId } = (await algoD.sendRawTransaction(txSigned).do()) as { txId: string };
  const { "application-index": appId } = await waitForConfirmation(algoD, txId, 10);
  if (!appId) throw new Error("Couldn't extract app ID from transaction response.");
  console.log("Created app: ", appId);
};
