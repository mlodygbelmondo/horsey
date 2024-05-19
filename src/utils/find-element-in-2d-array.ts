function findElementIn2DArray<T>(
  arr: T[][],
  element: T,
): [number, number] | null {
  for (let y = 0; y < arr.length; y++) {
    for (let x = 0; x < arr[y].length; x++) {
      if (arr[y][x] === element) {
        return [x, y];
      }
    }
  }
  return null;
}
export default findElementIn2DArray;
