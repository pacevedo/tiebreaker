import { Ties } from "./ties";
import { data } from "../data/data";
import { Context } from "../context/context";
import { Constants } from "../utils/constants";

const positions = [
    {"abr": "1","points": 37},
    {"abr": "2","points": 36},
    {"abr": "3","points": 36},
    {"abr": "4","points": 35},
    {"abr": "5","points": 35},
    {"abr": "6","points": 35}
];

const ties = ["2-3", "4-5-6"];

const context = new Context(Constants.FOOTBALL, Constants.LIGA);

test('Football - get duplicated scores', () => {
    const scores = Ties.getDuplicatedScores(positions, context);
    expect(scores.length).toBe(2);
    expect(scores).toContain(36);
    expect(scores).toContain(35);
});

test('Football - get teams tied by score', () => {
    const teams36 = Ties.getTeamsTiedByScore(36, positions, context);
    const teams35 = Ties.getTeamsTiedByScore(35, positions, context);
    expect(teams36).toBe("2-3");
    expect(teams35).toBe("4-5-6");
});

test('Football - get teams tied by combination', () => {
    const tiedTeams = [...Ties.getByCombination(positions, context)];
    expect(tiedTeams.length).toBe(2);
    expect(tiedTeams).toContain("2-3");
    expect(tiedTeams).toContain("4-5-6");
});

test('Football - get matches among tied teams', () => {
    const matches = Ties.getMatchesTiedTeams(ties);
    expect(matches).toContain("2-3");
    expect(matches).toContain("4-5");
    expect(matches).toContain("5-6");
    expect(matches).toContain("4-6");
    //TODO Set tieGames to context
    if (data.tieGames === 2){
        expect(matches.length).toBe(8);
        expect(matches).toContain("3-2");
        expect(matches).toContain("5-4");
        expect(matches).toContain("6-5");
        expect(matches).toContain("6-4");
    } else {
        expect(matches.length).toBe(4);
    }
});