import React from 'react'
import Fixtures from './fixtures'
import { Util } from '../utils/utils.js';
import { data, matches } from '../data/data.js';
import { useDispatch } from 'react-redux'
import { addCombination } from '../../redux/combination/combinationActions';
import { Ties } from './ties';
import { addScore } from '../../redux/score/scoreActions';
import { Scores } from './scores';
import { Context } from '../context/context';

function FixturesContainer() {

    const dispatch = useDispatch()

    /**
     * Set the combinations of fixtures in the pending matches
     * with the standings associated in any combination
     */
    const setCombinations = () => {
        let bin;
        const numCombinations = Math.pow(data.possibleFixtures.length, matches.length);
        let combinations = []
        for (let i = 0; i<numCombinations; i++) {
            bin = Util.ConvertBase(i).from(10).to(data.possibleFixtures.length);
            bin = Util.fillZeros(bin,matches.length);
            const combination = setCombination(bin);
            dispatch(addCombination(combination));
            combinations = [...combinations, combination];
        }
        return combinations;
    }

    /**
     * Return a single combination of fixture in the pending matches based on param bin
     * with the standings associated
     * @param {string} bin specify a combination of fixtures in n-base (n=different possible fixtures)
     */
    const setCombination = bin => {
        let matchesProcessed = [];
        const positions = Util.copy(data.teams);
        matches.forEach((match, index) => {
            const auxMatch = {local: match.local, visit: match.visit, result: data.possibleFixtures[bin[index]]};
            matchesProcessed.push(auxMatch);
            setPoints(auxMatch, positions); 
        });
        return {matches: matchesProcessed, positions: positions};
    }

    /**
     * Set the points/victories earned in every positions given a concrete match
     * @param {object} match 
     * @param {array} positions 
     */
    const setPoints = (match, positions) => {
        const indexLocal = positions.findIndex(item => item.name === match.local.name);
        const indexVisitor = positions.findIndex(item => item.name === match.visit.name);
        const context = new Context(data.sport, data.competition)
        if (indexLocal >= 0) {
            context.updateStandingsTeamFixture(match.result, true, positions[indexLocal]);
        }
        if (indexVisitor >= 0) {
            context.updateStandingsTeamFixture(match.result, false, positions[indexVisitor]);
        }
    }


    /**
     * Saves the scores ot the tie matches in the store
     */
    const saveScoresTieMatches = (tieMatches) => {
        tieMatches.forEach(match => {
            let aux = Util.toArr(match);
            const score = Scores.getScore(data.scores, aux[0], aux[1])
            let localScore, visitorScore
            if (score !== undefined) {
                localScore = score.localScore
                visitorScore = score.visitorScore
            }
            const tieMatch = {local: aux[0], visit: aux[1], localScore: localScore, visitorScore: visitorScore};
            dispatch(addScore(tieMatch))
        });
    }

    const combinations = setCombinations();
    const context = new Context(data.sport, data.competition, data.tieGames)
    const ties = Ties.getByCombinations(combinations, context)
    const tieMatches = Ties.getMatchesTiedTeams(ties)
    
    saveScoresTieMatches(tieMatches);
    
    return (
        <>
           <Fixtures matches={tieMatches} context={context} combinations={combinations}/> 
        </>
    )
}

export default FixturesContainer
