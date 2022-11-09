import { Branches, Scratch } from "../../constants/constants.js";

const maxUint64 = "0xffffffffffffffff";

export const createManyBoxes = `

${Branches.CreateManyBoxes_loop}:

load ${Scratch.ManyIndex}
int 127 // 16 tx times 8 ref is 128 box references max minus 1 since we need to pass a foreign app to augment budget
%
itob
dup
byte ${maxUint64}
box_put
box_get
assert
dup // gotta remember to pop that one if we don't have an error
byte ${maxUint64}
==
bnz ${Branches.Continue_manyBoxes_loop}

byte "failed to record and read max Uint64, expected max uint64, got: "
swap
concat
log
int 0 // gotta add a value back on the stack for the pop next paragraph

${Branches.Continue_manyBoxes_loop}:

pop
load ${Scratch.ManyIndex}
int 1
+
dup
store ${Scratch.ManyIndex}
load ${Scratch.Number}
<=
bnz ${Branches.CreateManyBoxes_loop}

`;
