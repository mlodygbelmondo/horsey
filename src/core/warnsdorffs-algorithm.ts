class Cell {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

// Move pattern on basis of the change of
// x coordinates and y coordinates respectively
const cx = [1, 1, 2, 2, -1, -1, -2, -2];
const cy = [2, -2, 1, -1, 2, -2, 1, -1];

// function restricts the knight to remain within chessboard
const limits = (x: number, y: number, N: number) => {
  return x >= 0 && y >= 0 && x < N && y < N;
};
// Checks whether a square is valid and empty or not
const isempty = (
  a: { [x: string]: number },
  x: number,
  y: number,
  N: number
) => {
  return limits(x, y, N) && a[y * N + x] < 0;
};

// Returns the number of empty squares adjacent to (x, y)
const getDegree = (a: any, x: number, y: number, N: number) => {
  let count = 0;
  for (let i = 0; i < N; i++) {
    if (isempty(a, x + cx[i], y + cy[i], N)) {
      count += 1;
    }
  }
  return count;
};

// Picks next point using Warnsdorff's heuristic.
// Returns false if it is not possible to pick
// next point.
const nextMove = (a: any, cell: Cell, N: number) => {
  let min_deg_idx = -1;
  let c = 0;
  let min_deg = N + 1;
  let nx = 0;
  let ny = 0;

  // Try all N adjacent of (*x, *y) starting
  // from a random adjacent. Find the adjacent
  // with minimum degree.
  let start = Math.floor(Math.random() * 1000) % N;
  for (let count = 0; count < N; count++) {
    const i = (start + count) % N;
    nx = cell.x + cx[i];
    ny = cell.y + cy[i];
    c = getDegree(a, nx, ny, N);
    if (isempty(a, nx, ny, N) && c < min_deg) {
      min_deg_idx = i;
      min_deg = c;
    }
  }

  // IF we could not find a next cell
  if (min_deg_idx == -1) {
    return null;
  }

  // Store coordinates of next point
  nx = cell.x + cx[min_deg_idx];
  ny = cell.y + cy[min_deg_idx];

  // Mark next move
  a[ny * N + nx] = a[cell.y * N + cell.x] + 1;

  // Update next point
  cell.x = nx;
  cell.y = ny;

  return cell;
};

// closed tour check
const neighbour = (x: number, y: number, xx: number, yy: number, N: number) => {
  for (let i = 0; i < N; i++) {
    if (x + cx[i] == xx && y + cy[i] == yy) {
      return true;
    } else {
      return false;
    }
  }
};

//  Generates the legal moves using warnsdorff's heuristics. Returns false if not possible
const findTour = (N: number, sx: number, sy: number): number[][] | false => {
  // Filling up the chessboard matrix with -1's
  let a = new Array(N * N).fill(-1);

  // Current points are same as initial points
  let cell = new Cell(sx, sy);

  a[cell.y * N + cell.x] = 1; // Mark first move.

  // Keep picking next points using Warnsdorff's heuristic
  let ret = null;
  for (let i = 0; i < N * N - 1; i++) {
    ret = nextMove(a, cell, N);
    if (ret == null) {
      return false;
    }
  }

  if (!ret) {
    return false;
  }

  const result = [];

  const mappedArr = a.map((el) => el - 1);

  while (mappedArr.length) {
    result.push(mappedArr.splice(0, N));
  }

  return result;
};

export const solveWithWarnsdorffs = (
  N: number,
  sx: number,
  sy: number
): [number[][] | false, number] => {
  let solution;

  const start = performance.now();
  do {
    solution = findTour(N, sx, sy);
  } while (!solution && start + 1000 > performance.now());
  const end = performance.now();

  const calculationTime = end - start;

  return [solution, calculationTime];
};
