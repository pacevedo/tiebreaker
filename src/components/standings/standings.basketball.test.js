import { Constants } from "../utils/constants";
import { Context } from "../context/context";
import { Standings } from "./standings";

/********************* SAMPLES ****************************/

const team1 = {"abr": "1","wins": 7, "favor": 0, "against": 0};
const team2 = {"abr": "2","wins": 7, "favor": 0, "against": 0};
const team3 = {"abr": "3","wins": 6, "favor": 0, "against": 0};
const team4 = {"abr": "4","wins": 5, "favor": 0, "against": 0};
const team5 = {"abr": "5","wins": 5, "favor": 0, "against": 0};
const team6 = {"abr": "6","wins": 5, "favor": 0, "against": 0};
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
  {local: team5, visit: team4, result: 1},
  {local: team1, visit: team7, result: 2},
  {local: team2, visit: team6, result: 1},
  {local: team8, visit: team3, result: 2}
];

const combination = {
  "matches": matches,
  "positions": positions
};

const scores = [
  {"local": "1", "visit": "2", "localScore": 98, "visitorScore": 78},
  {"local": "2", "visit": "1", "localScore": 86, "visitorScore": 82},
  {"local": "4", "visit": "5", "localScore": 74, "visitorScore": 67},
  {"local": "4", "visit": "6", "localScore": 66, "visitorScore": 85},
  {"local": "6", "visit": "4", "localScore": 85, "visitorScore": 84},
  {"local": "5", "visit": "6", "localScore": 71, "visitorScore": 76},
  {"local": "6", "visit": "5", "localScore": 85, "visitorScore": 80}
];

const context = new Context(Constants.BASKETBALL, Constants.EUROLEAGUE, 2);

test('get standings updated for a team (with score)', () => {
  const team = "1";
  const standings1 = context.initParticular();
  Standings.updateTeam(team,scores,"1-2",standings1,context,combination.matches);
  expect(standings1.wins).toBe(1);
  expect(standings1.pointsFavor).toBe(98);
  expect(standings1.pointsAgainst).toBe(78);
});

test('get standings updated for a team (with pending match)', () => {
  const team = "5";
  const standings5 = context.initParticular();
  Standings.updateTeam(team,scores,"5-4",standings5,context,combination.matches);
  expect(standings5.wins).toBe(1);
  expect(standings5.pointsFavor).toBe(0);
  expect(standings5.pointsAgainst).toBe(0);
});

test('get standings updated', () => {
  const standings = Standings.get(combination, scores, context);
  expect(standings.length).toBe(6);
  const standings1 = standings[0];
  expect(standings1.abr).toBe(team1.abr)
  expect(standings1.particular[0].wins).toBe(1);
  expect(standings1.particular[0].pointsFavor).toBe(180);
  expect(standings1.particular[0].pointsAgainst).toBe(164);
  expect(standings1.particular[0].difference).toBe(16);
  const standings2 = standings[1];
  expect(standings2.abr).toBe(team2.abr)
  expect(standings2.particular[0].wins).toBe(1);
  expect(standings2.particular[0].pointsFavor).toBe(164);
  expect(standings2.particular[0].pointsAgainst).toBe(180);
  expect(standings2.particular[0].difference).toBe(-16);
  const standings3 = standings[2];
  expect(standings3.abr).toBe(team3.abr)
  expect(standings3.particular).toBeUndefined();
  const standings4 = standings[3];
  expect(standings4.abr).toBe(team6.abr)
  expect(standings4.particular[0].wins).toBe(4);
  expect(standings4.particular[0].pointsFavor).toBe(331);
  expect(standings4.particular[0].pointsAgainst).toBe(301);
  expect(standings4.particular[0].difference).toBe(30);
  const standings5 = standings[4];
  expect(standings5.abr).toBe(team4.abr)
  expect(standings5.particular[0].wins).toBe(1);
  expect(standings5.particular[0].pointsFavor).toBe(224);
  expect(standings5.particular[0].pointsAgainst).toBe(237);
  expect(standings5.particular[0].difference).toBe(-13);
  const standings6 = standings[5];
  expect(standings6.abr).toBe(team5.abr)
  expect(standings6.particular[0].wins).toBe(1);
  expect(standings6.particular[0].pointsFavor).toBe(218);
  expect(standings6.particular[0].pointsAgainst).toBe(235);
  expect(standings6.particular[0].difference).toBe(-17);
  const otherStandings = Standings.getOtherPossibilities(combination, standings, scores, context)
  expect(otherStandings.length).toBe(1)
  expect(otherStandings[0][0].abr).toBe(team1.abr)
  expect(otherStandings[0][1].abr).toBe(team2.abr)
  expect(otherStandings[0][2].abr).toBe(team3.abr)
  expect(otherStandings[0][3].abr).toBe(team6.abr)
  expect(otherStandings[0][4].abr).toBe(team5.abr)
  expect(otherStandings[0][5].abr).toBe(team4.abr)
});

test('get incomplete matches', () => {
  const standings = Standings.get(combination, scores, context);
  const incompleteMatches1 = Standings.getIncompleteMatches(standings.slice(0,2), scores, context);
  const incompleteMatches2 = Standings.getIncompleteMatches(standings.slice(3), scores, context);
  expect(incompleteMatches1.length).toBe(0)
  expect(incompleteMatches2.length).toBe(1)
  const team1Incomplete = incompleteMatches2[0].team1
  const team2Incomplete = incompleteMatches2[0].team2
  expect(team1Incomplete.abr).toBe(team4.abr)
  expect(team2Incomplete.abr).toBe(team5.abr)
})