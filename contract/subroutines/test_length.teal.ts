import { Branches, Scratch } from "../../constants/constants.js";

export const test_length = `

load ${Scratch.Curr}
box_len
assert
dup
store ${Scratch.ActualLength}
load ${Scratch.Length}
==
bnz ${Branches.Finish_test_length}

// log an eventual error
byte "the length of a created box did not match the value given by box_len, expected "
load ${Scratch.Length}
itob
concat
byte ", but got "
concat
load ${Scratch.ActualLength}
itob
concat
log

${Branches.Finish_test_length}:
retsub

`;
