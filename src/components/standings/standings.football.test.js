import { Constants } from "../utils/constants";
import { Context } from "../context/context";
import { Standings } from "./standings";

/********************* SAMPLES ****************************/

const team1 = {"abr": "1","points": 37, "favor": 0, "against": 0};
const team2 = {"abr": "2","points": 36, "favor": 0, "against": 0};
const team3 = {"abr": "3","points": 36, "favor": 0, "against": 0};
const team4 = {"abr": "4","points": 35, "favor": 0, "against": 0};
const team5 = {"abr": "5","points": 35, "favor": 0, "against": 0};
const team6 = {"abr": "6","points": 35, "favor": 0, "against": 0};
const team7 = {"abr": "7"};
const team8 = {"abr": "8"};

const positions = [
    team1,
    team2,
    team3,
    team4,
    team5,
    team6
];

const matches = [
  {local: team3, visit: team2, result: 1},
  {local: team1, visit: team6, result: 2},
  {local: team4, visit: team7, result: 1},
  {local: team8, visit: team5, result: 2}
];

const combination = {
    "matches": matches,
    "positions": positions
};

const scores = [
    {"local": "2", "visit": "3", "localScore": 2, "visitorScore": 0},
    {"local": "4", "visit": "5", "localScore": 1, "visitorScore": 1},
    {"local": "5", "visit": "4", "localScore": 2, "visitorScore": 1},
    {"local": "4", "visit": "6", "localScore": 0, "visitorScore": 3},
    {"local": "6", "visit": "4", "localScore": 2, "visitorScore": 2},
    {"local": "5", "visit": "6", "localScore": 3, "visitorScore": 1},
    {"local": "6", "visit": "5", "localScore": 2, "visitorScore": 0}
]

const context = new Context(Constants.FOOTBALL, Constants.LIGA, 2);

test('get standings updated for a team (with score)', () => {
  const team = "2";
  const standings2 = context.initParticular();
  Standings.updateTeam(team,scores,"2-3",standings2,context,combination.matches);
  expect(standings2.points).toBe(3);
  expect(standings2.goalsFavor).toBe(2);
  expect(standings2.goalsAgainst).toBe(0);
});

test('get standings updated for a team (with pending match)', () => {
  const team = "3";
  const standings3 = context.initParticular();
  Standings.updateTeam(team,scores,"3-2",standings3,context,combination.matches);
  expect(standings3.points).toBe(3);
  expect(standings3.goalsFavor).toBe(0);
  expect(standings3.goalsAgainst).toBe(0);
});

test('get standings updated', () => {
  const standings = Standings.get(combination, scores, context);
  expect(standings.length).toBe(6);
  const standings1 = standings[0];
  expect(standings1.particular).toBeUndefined();
  const standings2 = standings[1];
  expect(standings2.particular[0].points).toBe(3);
  expect(standings2.particular[0].goalsFavor).toBe(2);
  expect(standings2.particular[0].goalsAgainst).toBe(0);
  const standings3 = standings[2];
  expect(standings3.particular[0].points).toBe(3);
  expect(standings3.particular[0].goalsFavor).toBe(0);
  expect(standings3.particular[0].goalsAgainst).toBe(2);
  const standings4 = standings[3];
  expect(standings4.particular[0].points).toBe(7);
  expect(standings4.particular[0].goalsFavor).toBe(8);
  expect(standings4.particular[0].goalsAgainst).toBe(5);
  const standings5 = standings[4];
  expect(standings5.particular[0].points).toBe(7);
  expect(standings5.particular[0].goalsFavor).toBe(6);
  expect(standings5.particular[0].goalsAgainst).toBe(5);
  const standings6 = standings[5];
  expect(standings6.particular[0].points).toBe(2);
  expect(standings6.particular[0].goalsFavor).toBe(4);
  expect(standings6.particular[0].goalsAgainst).toBe(8);
});

test('get incomplete matches', () => {
  const standings = Standings.get(combination, scores, context);
  const incompleteMatches1 = Standings.getIncompleteMatches(standings.slice(1,3), scores, context);
  const incompleteMatches2 = Standings.getIncompleteMatches(standings.slice(3), scores, context);
  expect(incompleteMatches1.length).toBe(1)
  expect(incompleteMatches2.length).toBe(0)
  const team1Incomplete = incompleteMatches1[0].team1
  const team2Incomplete = incompleteMatches1[0].team2
  expect(team1Incomplete.abr).toBe(team2.abr)
  expect(team2Incomplete.abr).toBe(team3.abr)
})