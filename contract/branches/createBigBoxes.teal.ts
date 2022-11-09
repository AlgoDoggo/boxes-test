import { Branches, Scratch } from "../../constants/constants.js";
import { read_box } from "./read_box.teal.js";
import { write_to_box } from "./write_to_box.teal.js";

export const createBigBoxes = `

global CreatorAddress //  32 bytes
load ${Scratch.Number}
itob
dupn 3
concat // 40 bytes
concat // 48
concat // 56
concat // now 64 bytes
dup
store ${Scratch.Curr} // I'll store the name in a variable for later

int 32768 // keep in mind this will augment mbr by 13.122500 algos for each loop iteration if we didn't delete the box
int 64 // substract length of name
-
dup
store ${Scratch.Length} // let's save the box bytelength
box_create
assert
callsub test_length

// let's write some data
${write_to_box}

// now let's read and assert all is in order
${read_box}

// now delete the box to free up the mbr
load ${Scratch.Curr}
box_del
assert

// rinse and repeat for as long as app args 1 says we should
load ${Scratch.Number}
int 1
-
dup
store ${Scratch.Number}
bz ${Branches.Allow} // exit if we're done

// let's reset the counters since we're doing another loop
int 0
store ${Scratch.ReadIndex}
int 0
store ${Scratch.Index}

`;
