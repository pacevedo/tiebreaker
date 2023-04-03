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

test("get indexes combinated empty", () => {
  const arr = [];
  const result = Standings.getIndexesCombinated(arr);
  const expected = [[]];
  expect(result).toEqual(expected);
});

test("get indexes combinated 1", () => {
  const arr = [2, 3];
  const result = Standings.getIndexesCombinated(arr);
  const expected = [
    [0, 0],
    [1, 0],
    [0, 1],
    [1, 1],
    [0, 2],
    [1, 2],
  ];
  expect(result).toEqual(expected);
});

test('get indexes combinated 2', () => {
  const indexes = Standings.getIndexesCombinated(lengths);
  expect(indexes.length).toBe(indexesCombinated.length);
  expect(indexes.sort()).toEqual(indexesCombinated.sort());
});

describe("getBoundariesTeamsTied", () => {
  const standings = [
    { abr: "AAA", points: 10 },
    { abr: "BBB", points: 8 },
    { abr: "CCC", points: 8 },
    { abr: "DDD", points: 6 }
  ];

  it("returns correct boundaries when all teams are tied", () => {
    const teamsTied = [
      { abr: "AAA", points: 10 },
      { abr: "BBB", points: 8 },
      { abr: "CCC", points: 8 }
    ];
    const boundaries = Standings.getBoundariesTeamsTied(teamsTied, standings);
    expect(boundaries).toEqual({ top: 0, bottom: 2 });
  });

  it("returns correct boundaries when some teams are tied", () => {
    const teamsTied = [
      { abr: "BBB", points: 8 },
      { abr: "CCC", points: 8 }
    ];
    const boundaries = Standings.getBoundariesTeamsTied(teamsTied, standings);
    expect(boundaries).toEqual({ top: 1, bottom: 2 });
  });

  it("returns correct boundaries when only one team is tied", () => {
    const teamsTied = [{ abr: "DDD", points: 6 }];
    const boundaries = Standings.getBoundariesTeamsTied(teamsTied, standings);
    expect(boundaries).toEqual({ top: 3, bottom: 3 });
  });

  it("returns correct boundaries when there are no tied teams", () => {
    const teamsTied = [{ abr: "EEE", points: 4 }];
    const boundaries = Standings.getBoundariesTeamsTied(teamsTied, standings);
    expect(boundaries).toEqual({ top: undefined, bottom: undefined });
  });
});