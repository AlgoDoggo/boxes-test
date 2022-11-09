import { algoD, algoD_fallback, algoD_fallback2 } from "../constants/constants.js";

// Going to use a Linked list rather than an array for the O(1) dequeue operation
class Node {
  val: Uint8Array[];
  next: Node | null;
  constructor(val: Uint8Array[]) {
    this.val = val;
    this.next = null;
  }
}

class Queue {
  front: Node | null;
  back: Node | null;
  size: number;
  constructor() {
    this.front = null;
    this.back = null;
    this.size = 0;
  }
  enqueue(val: Uint8Array[]) {
    const node = new Node(val);
    if (this.back == null) {
      this.back = node;
      this.front = this.back;
    } else {
      this.back.next = node;
      this.back = node;
    }
    this.size++;
  }
  dequeue(): Uint8Array[] | null {
    if (this.front == null) return null;
    const val = this.front.val;
    this.front = this.front.next;
    if (this.front == null) this.back = null;
    this.size--;
    return val;
  }
}

export const broadcastCalls = async (txs: Uint8Array[][]) => {
  const queue = new Queue();
  txs.forEach((tx) => queue.enqueue(tx));

  while (queue.size > 0) {
    // space the calls out a a little
    await new Promise((res) => setTimeout(res, 30));

    const front = queue.dequeue();

    // pick alternate providers
    try {
      if (queue.size % 3 == 0) {
        void algoD.sendRawTransaction(front!).do();
      } else if (queue.size % 3 == 1) {
        void algoD_fallback.sendRawTransaction(front!).do();
      } else {
        void algoD_fallback2.sendRawTransaction(front!).do();
      }
    } catch (error) {
      error instanceof Error && console.log(error.message);
    }
  }
};
