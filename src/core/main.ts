import { solveKTAsync } from "./kt-backtracking";

const main = async () => {
  const res = await solveKTAsync(0, 0, 8);
  console.log(res);
};

main();
