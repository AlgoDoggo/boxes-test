import { Branches, Scratch, Subroutines } from "../constants/constants.js";
import { createBigBoxes } from "./branches/createBigBoxes.teal.js";
import { createManyBoxes } from "./branches/createManyBoxes.teal.js";
import { maxOutBudget } from "./subroutines/maxOutBudget.teal.js";
import { test_length } from "./subroutines/test_length.teal.js";

export const app = `
#pragma version 8

txn ApplicationID
bz ${Branches.Allow}

txn OnCompletion
int NoOp
==
assert

// exit early if call is a noop
txna ApplicationArgs 0
byte "noop"
==
bnz ${Branches.Allow}

// how many boxes to create?
txna ApplicationArgs 1
btoi
store ${Scratch.Number}

// how many noop calls to max out our opcode budget?
txna ApplicationArgs 2
btoi
store ${Scratch.NumberOfNoops}

txna ApplicationArgs 0
byte "${Branches.CreateBigBoxes}"
==
bnz ${Branches.CreateBigBoxes}

txna ApplicationArgs 0
byte "${Branches.CreateManyBoxes}"
==
bnz ${Branches.CreateManyBoxes}


err


//////////////// branches


${Branches.CreateManyBoxes}:
// start by maxing out the opcode budget
callsub ${Subroutines.Max_out_budget}
${createManyBoxes}
b ${Branches.Allow}


${Branches.CreateBigBoxes}:
// start maxing out the opcode budget
callsub ${Subroutines.Max_out_budget}
${createBigBoxes}
b ${Branches.CreateBigBoxes}


////////////// subroutines

${Subroutines.Test_length}:
${test_length}
retsub

${Subroutines.Max_out_budget}:
${maxOutBudget}
retsub


///////////// end of program

${Branches.Allow}:
int 1
`;
