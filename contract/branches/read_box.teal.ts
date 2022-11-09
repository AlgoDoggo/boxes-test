import { Branches, Scratch } from "../../constants/constants.js";

export const read_box = `

${Branches.Read_box_loop}:

load ${Scratch.Curr} // name of the box
load ${Scratch.ReadIndex} // current index to start reading bytes, starts at 0
int 64 // let's read 64 bytes at a time
box_extract
dup
store ${Scratch.ActualRead}
load ${Scratch.Curr} // let's check it matches expected value
==
bnz ${Branches.Continue_read}

// log an eventual error
byte "the read operation on a created box did not match the expected value, expected "
load ${Scratch.Curr}
concat
byte ", but got "
concat
load ${Scratch.ActualRead}
concat
log

${Branches.Continue_read}:
load ${Scratch.ReadIndex}
int 64
+
dup
store ${Scratch.ReadIndex}
int 64
+
load ${Scratch.Length}
<= // just going to check we can do one more loop iteration else exit
bnz ${Branches.Read_box_loop}

`;
