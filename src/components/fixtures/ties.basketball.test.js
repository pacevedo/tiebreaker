import { Ties } from "./ties";
import { data } from "../data/data";
import { Context } from "../context/context";
import { Constants } from "../utils/constants";

const positions = [
  {"abr": "1","wins": 7},
  {"abr": "2","wins": 7},
  {"abr": "3","wins": 6},
  {"abr": "4","wins": 5},
  {"abr": "5","wins": 5},
  {"abr": "6","wins": 5}
];

const positionsDetailed = [
  {"abr": "1","wins": 7, particular: [{"wins": 1}]},
  {"abr": "2","wins": 7, particular: [{"wins": 1}]},
  {"abr": "3","wins": 6},
  {"abr": "4","wins": 5, particular: [{"wins": 4},{"wins": 1}]},
  {"abr": "5","wins": 5, particular: [{"wins": 4},{"wins": 1}]},
  {"abr": "6","wins": 5, particular: [{"wins": 2},{"wins": 2}]},
  {"abr": "7","wins": 5, particular: [{"wins": 2},{"wins": 0}]},
  {"abr": "8","wins": 4, particular: [{"wins": 2}]},
  {"abr": "9","wins": 4, particular: [{"wins": 2}]},
  {"abr": "10","wins": 4, particular: [{"wins": 2}]},
  {"abr": "11","wins": 3, particular: [{"wins": 2}]},
  {"abr": "12","wins": 3, particular: [{"wins": 0}]},
]

const ties = ["1-2","4-5-6"];

const context = new Context(Constants.BASKETBALL, Constants.EUROLEAGUE);

test('get duplicated scores', () => {
  const scores = Ties.getDuplicatedScores(positions, context);
  expect(scores.length).toBe(2);
  expect(scores).toContain(7);
  expect(scores).toContain(5);
});

test('get teams tied by score', () => {
  const teams7 = Ties.getTeamsTiedByScore(7, positions, context);
  const teams5 = Ties.getTeamsTiedByScore(5, positions, context);
  expect(teams7).toBe("1-2");
  expect(teams5).toBe("4-5-6");
});

test('get teams tied by combination', () => {
  const tiedTeams = [...Ties.getByCombination(positions, context)];
  expect(tiedTeams.length).toBe(2);
  expect(tiedTeams).toContain("1-2");
  expect(tiedTeams).toContain("4-5-6");
});

test('get matches among tied teams', () => {
  const matches = Ties.getMatchesTiedTeams(ties);
  expect(matches).toContain("1-2");
  expect(matches).toContain("4-5");
  expect(matches).toContain("5-6");
  expect(matches).toContain("4-6");
  //TODO Set tieGames to context
  if (data.tieGames === 2){
      expect(matches.length).toBe(8);
      expect(matches).toContain("2-1");
      expect(matches).toContain("5-4");
      expect(matches).toContain("6-5");
      expect(matches).toContain("6-4");
  } else {
      expect(matches.length).toBe(4);
  }
});

test('get teams tied particular average', () => {
  // not recursive
  const arrPositions = Ties.getPositionsTiedByCombination(positionsDetailed, context, false, -1)
  expect(arrPositions.length).toBe(4)
  expect(arrPositions[0].length).toBe(2)
  expect(arrPositions[1].length).toBe(2)
  expect(arrPositions[2].length).toBe(2)
  expect(arrPositions[3].length).toBe(3)
  expect(arrPositions[0][0].abr).toBe("1")
  expect(arrPositions[0][1].abr).toBe("2")
  expect(arrPositions[1][0].abr).toBe("4")
  expect(arrPositions[1][1].abr).toBe("5")
  expect(arrPositions[2][0].abr).toBe("6")
  expect(arrPositions[2][1].abr).toBe("7")
  expect(arrPositions[3][0].abr).toBe("8")
  expect(arrPositions[3][1].abr).toBe("9")
  expect(arrPositions[3][2].abr).toBe("10")
  // recursive
  const arrPositionsRecursive = Ties.getPositionsTiedByCombination(positionsDetailed, context, true, -1)
  expect(arrPositionsRecursive.length).toBe(3)
  expect(arrPositionsRecursive[0].length).toBe(2)
  expect(arrPositionsRecursive[1].length).toBe(2)
  expect(arrPositionsRecursive[2].length).toBe(3)
  expect(arrPositionsRecursive[0][0].abr).toBe("1")
  expect(arrPositionsRecursive[0][1].abr).toBe("2")
  expect(arrPositionsRecursive[1][0].abr).toBe("4")
  expect(arrPositionsRecursive[1][1].abr).toBe("5")
  expect(arrPositionsRecursive[2][0].abr).toBe("8")
  expect(arrPositionsRecursive[2][1].abr).toBe("9")
  expect(arrPositionsRecursive[2][2].abr).toBe("10")
})