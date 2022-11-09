import { appBudget, Branches, Scratch } from "../../constants/constants.js";

export const maxOutBudget = `

${Branches.MaxOut_loop}:

itxn_begin

int appl
itxn_field TypeEnum
int NoOp
itxn_field OnCompletion
int ${appBudget}
itxn_field ApplicationID

itxn_submit

load ${Scratch.CurrentNumberOfNoops}
int 1
+
dup
store ${Scratch.CurrentNumberOfNoops}
load ${Scratch.NumberOfNoops}
<= 
bnz ${Branches.MaxOut_loop}

// reset the var on exit 
int 0
store ${Scratch.CurrentNumberOfNoops}

`;
