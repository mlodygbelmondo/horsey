type Solution = number[][];

let moveCount = 0;

const solveKT = (startingX: number, startingY: number, N: number) => {
  const solution: Solution = Array.from({ length: N }, () =>
    Array.from({ length: N }, () => -1),
  );

  const xMove = [2, 1, -1, -2, -2, -1, 1, 2];
  const yMove = [1, 2, 2, 1, -1, -2, -2, -1];

  solution[startingX][startingY] = 0;

  if (!solveKTUtil(startingX, startingY, 1, solution, xMove, yMove, N)) {
    console.log("Solution does not exist");
    return false;
  } else {
    return solution;
  }
};

const solveKTUtil = (
  x: number,
  y: number,
  movei: number,
  solution: Solution,
  xMove: number[],
  yMove: number[],
  N: number,
) => {
  let k: number;
  let nextX: number;
  let nextY: number;
  if (movei == N * N) {
    return true;
  }

  moveCount++;

  for (k = 0; k < 8; k++) {
    nextX = x + xMove[k];
    nextY = y + yMove[k];
    if (isSafe(nextX, nextY, N, solution)) {
      solution[nextX][nextY] = movei;
      if (solveKTUtil(nextX, nextY, movei + 1, solution, xMove, yMove, N)) {
        return true;
      } else {
        solution[nextX][nextY] = -1;
      }
    }
  }

  return false;
};

const solveKTAsync = (startingX: number, startingY: number, N: number) =>
  new Promise<Solution | boolean>((resolve) => {
    const res = solveKT(startingX, startingY, N);
    console.log(moveCount);
    resolve(res);
  });

const isSafe = (x: number, y: number, N: number, solution: Solution) => {
  return x >= 0 && x < N && y >= 0 && y < N && solution[x][y] == -1;
};

export { solveKT, solveKTAsync, type Solution };
