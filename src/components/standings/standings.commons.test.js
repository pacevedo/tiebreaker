import { Standings } from "./standings";

const lengths = [3,2,2,2]

const indexesCombinated = [
  [0,0,0,0],
  [0,0,0,1],
  [0,0,1,0],
  [0,0,1,1],
  [0,1,0,0],
  [0,1,0,1],
  [0,1,1,0],
  [0,1,1,1],
  [1,0,0,0],
  [1,0,0,1],
  [1,0,1,0],
  [1,0,1,1],
  [1,1,0,0],
  [1,1,0,1],
  [1,1,1,0],
  [1,1,1,1],
  [2,0,0,0],
  [2,0,0,1],
  [2,0,1,0],
  [2,0,1,1],
  [2,1,0,0],
  [2,1,0,1],
  [2,1,1,0],
  [2,1,1,1]
]

test('get indexes combinated', () => {
  const indexes = Standings.getIndexesCombinated(lengths);
  expect(indexes.length).toBe(indexesCombinated.length);
  expect(indexes.sort()).toEqual(indexesCombinated.sort());
});