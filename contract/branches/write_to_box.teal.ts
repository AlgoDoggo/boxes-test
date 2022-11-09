import { Branches, Scratch } from "../../constants/constants.js";

export const write_to_box = `

${Branches.Write_to_box_loop}:

load ${Scratch.Curr} // name of the box
load ${Scratch.Index} // current index to start writing bytes, starts at 0
load ${Scratch.Curr} // going to fill the box with its name, because why not
box_replace
load ${Scratch.Index}
int 64
+
dup
store ${Scratch.Index}
int 64
+
load ${Scratch.Length}
<= // just going to check we can do one more loop iteration else exit

bnz ${Branches.Write_to_box_loop}

`;
