/* eslint-disable no-restricted-globals */

import { solveKT } from "@/core/kt-backtracking";

interface Params {
  startingX: number;
  startingY: number;
  N: number;
}

self.onmessage = (e: MessageEvent<Params>) => {
  const { startingX, startingY, N } = e.data;

  const start = performance.now();
  const solution = solveKT(startingX, startingY, N);
  const end = performance.now();

  self.postMessage({
    solution,
    calculationTime: end - start,
  });
};

export {};
