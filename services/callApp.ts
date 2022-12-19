import {
  assignGroupID,
  decodeAddress,
  encodeUint64,
  makeApplicationNoOpTxnFromObject,
  mnemonicToSecretKey,
  Transaction,
} from "algosdk";
import { algoParams, appBudget, appIndex } from "../constants/constants.js";
import { encodeArg } from "../utils/utils.js";
import { randomBytes } from "crypto";

const account = mnemonicToSecretKey(process.env.MNEMO!);
const { publicKey } = decodeAddress("ABS635VYWVL3CKPFMBCQFA5VXZ2AKXLY6M636KCRJ4ZP4VA2NUXMNWELQ4");
const suggestedParams = await algoParams();

export const callAppBigBoxes = (testRuns: number, NumberOfNoops: number) => {
  const boxNames = [];
  for (let i = 1; i <= testRuns; i++) {
    const boxName = new Uint8Array(64);
    boxName.set(publicKey, 0);
    boxName.set(encodeUint64(i), 32);
    boxName.set(encodeUint64(i), 40);
    boxName.set(encodeUint64(i), 48);
    boxName.set(encodeUint64(i), 56);
    boxNames.push({ appIndex: 0, name: boxName });
  }

  const tx0 = makeApplicationNoOpTxnFromObject({
    from: account.addr,
    appIndex,
    appArgs: [encodeArg("createBigBoxes"), encodeUint64(testRuns), encodeUint64(NumberOfNoops)],
    suggestedParams: {
      ...suggestedParams,
      fee: suggestedParams.fee * (NumberOfNoops * testRuns + 1),
    },
    foreignApps: [appBudget],
    lease: new Uint8Array(randomBytes(32)),
    boxes: new Array(7).fill(boxNames[0]),
  });

  const txsForRefs: Transaction[] = [];
  for (let i = 0; i <= 9; i++) {
    txsForRefs.push(
      makeApplicationNoOpTxnFromObject({
        from: account.addr,
        appIndex,
        appArgs: [encodeArg("noop")],
        suggestedParams,
        lease: new Uint8Array(randomBytes(32)),
        boxes: new Array(8).fill(boxNames[i]),
      })
    );
  }
  const txs = [tx0, ...txsForRefs];

  assignGroupID(txs);
  return txs.map((tx) => tx.signTxn(account.sk));
};

export const callAppManyBoxes = (numberOfBoxes: number, NumberOfNoops: number) => {
  const boxNames = [];
  for (let i = 0; i < 128; i++) {
    boxNames.push({ appIndex: 0, name: encodeUint64(i) });
  }

  const tx0 = makeApplicationNoOpTxnFromObject({
    from: account.addr,
    appIndex,
    appArgs: [encodeArg("createManyBoxes"), encodeUint64(numberOfBoxes), encodeUint64(NumberOfNoops)],
    suggestedParams: {
      ...suggestedParams,
      fee: suggestedParams.fee * (NumberOfNoops + 1),
    },
    foreignApps: [appBudget],
    lease: new Uint8Array(randomBytes(32)),
    boxes: boxNames.slice(0, 7),
  });

  const txsForRefs: Transaction[] = [];
  for (let i = 0; i < 15; i++) {
    txsForRefs.push(
      makeApplicationNoOpTxnFromObject({
        from: account.addr,
        appIndex,
        appArgs: [encodeArg("noop")],
        suggestedParams,
        lease: new Uint8Array(randomBytes(32)),
        boxes: boxNames.slice(7 + i * 8, 7 + (i + 1) * 8),
      })
    );
  }
  const txs = [tx0, ...txsForRefs];
  assignGroupID(txs);
  return txs.map((tx) => tx.signTxn(account.sk));
};
