import algosdk from "algosdk";

const nodeUrl = "https://betanet-api.algonode.cloud";
const indexerUrl = "https://betanet-idx.algonode.cloud";

const nodeUrl_purestake = "https://betanet-algorand.api.purestake.io/ps2";
const purestakeHeader = { "X-API-Key": process.env.PURESTAKE! };

const nodeUrl_randlabs = "https://node.betanet.algoexplorerapi.io";

export const algoD = new algosdk.Algodv2("", nodeUrl, "");
export const algoIndexer = new algosdk.Indexer("", indexerUrl, "");
export const algoD_fallback = new algosdk.Algodv2(purestakeHeader, nodeUrl_purestake, "");
export const algoD_fallback2 = new algosdk.Algodv2("", nodeUrl_randlabs, "");

export const algoParams = async () => {
  const sp = await algoD.getTransactionParams().do();
  sp.fee = 1000;
  sp.flatFee = true;
  return sp;
};

export const appIndex = 1326448275;
export const appBudget = 1325420875;

export enum Scratch {
  Number,
  Curr,
  Length,
  Index,
  ActualLength,
  ReadIndex,
  ActualRead,
  NumberOfNoops,
  CurrentNumberOfNoops,
  ManyIndex,
}

export enum Branches {
  CreateBigBoxes = "createBigBoxes",
  CreateManyBoxes = "createManyBoxes",
  Allow = "allow",
  Write_to_box_loop = "write_to_box_loop",
  Continue_read = "continue_read",
  Read_box_loop = "read_box_loop",
  CreateManyBoxes_loop = "createManyBoxes_loop",
  Continue_manyBoxes_loop = "continue_manyBoxes_loop",
  MaxOut_loop = "maxOut_loop",
  Finish_test_length = "finish_test_length",
}

export enum Subroutines {
  Test_length = "test_length",
  Max_out_budget = "max_out_budget",
}
