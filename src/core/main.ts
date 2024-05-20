import { solveKTAsync } from "./kt-backtracking";

const main = async () => {
  const res = await solveKTAsync(2, 2, 3);
  console.log(res);
};

main();
