import { Constants } from "../utils/constants"
import { Util } from "../utils/utils";

import { Order } from "../standings/order";
import { data } from "../data/data";


export const Ties = {


  /**
   * Retrieve a set of ties between teams for the given combinations
   */
  getByCombinations: (combinations, context) => {
    let ties = new Set();
    combinations.forEach(function(comb) {
      const positions = Util.copy(comb.positions);
      const auxTies = Ties.getByCombination(positions, context); 
      ties = new Set([...ties, ...auxTies]);
    });
    return ties;
  },

  /**
   * Retrieve a set of ties between teams for the given combination
   */
  getByCombination: (positions, context) => {
    let ties = new Set();
    positions.sort(Order.initial);
    const scores = Ties.getDuplicatedScores(positions, context);
    scores.forEach(score => {
      ties.add(Ties.getTeamsTiedByScore(score, positions, context))
    });
    return ties;
  },

  /**
   * Retrieve the positions of the standings with teams tied
   */
  getPositionsTiedByCombination: (standings, context, recursive, i, arrPositions) => {
    let scores = []
    if (arrPositions === undefined) {
      arrPositions = []
    }
    if (i < 0) {
      scores = Ties.getDuplicatedScores(standings, context)
    } else {
      scores = Ties.getDuplicatedScores(standings, context, true, i);
    }
    scores.forEach(score => {
      let positions = standings.filter(item => context.getElement(Constants.SCORE, i < 0 ? item: item.particular[i]) === score)
      if (i < 0) {
        Ties.getPositionsTiedByCombination(positions, context, recursive, 0, arrPositions)
      } else {
        let particularArr = positions.map(team => team.particular)
        if (recursive && Util.getMinLengthArrayOfArray(particularArr) > i+1) {
          Ties.getPositionsTiedByCombination(positions, context, recursive, i+1, arrPositions)
        } else {
          arrPositions.push(positions)
        }
      }
    });
    return arrPositions
  },

  /**
   * Retrieve the scores that are duplicated for the given combination
   */
  getDuplicatedScores: (positions, context, particular, i) => {
    // Get the scores of the combination in an array
    let scoreArr = []
    if (particular) {
      scoreArr = positions.map(item => context.getElement(Constants.SCORE, item.particular[i]));
    } else {
      scoreArr = positions.map(item => context.getElement(Constants.SCORE, item));
    }
    // Get just the non-unique values
    return scoreArr.reduce(function(acc, el, i, arr) {
      if (arr.indexOf(el) !== i && acc.indexOf(el) < 0) acc.push(el); return acc;
    }, []);
  },

  /**
   * Retrieve a string with the teams that have the same score for the given combination
   * The format will be: abr1-abr2
   */
  getTeamsTiedByScore: (score, positions, context) => {
    const teams = positions.filter(item => context.getElement(Constants.SCORE, item) === score);
    const teamsArr = teams.map(team => team.abr);
    return Util.toStr(teamsArr,true);
  },

  /**
   * Retrieve the matches among tied teams
   */
  getMatchesTiedTeams: (ties) => {
    let matches = new Set();
    ties.forEach(tie => {
      const tieArr = Util.toArr(tie)
      const arrMatches = Util.getCombinations(tieArr, 2)
      arrMatches.forEach(item => {
        matches.add(Util.toStr(item, false))
        if (data.tieGames === 2){
          const returnMatch = Util.toStr([item[1], item[0]],false)
          matches.add(returnMatch)
        }
      }) 
    })
    return [...matches];
  },

  /**
   * Checks if there is any match pending for untie a tie breaker
   */
  isTieBreakerIncomplete: (matches, context) => {
    const match1 = matches[0]
    const match2 = matches[1]
    const localScore1 = match1 !== undefined ? match1.localScore : ""
    const localScore2 = match2 !== undefined ? match2.localScore : ""
    if (context.tieGames === 1){
      if ((localScore1 === "" || localScore1 === undefined) && 
        (localScore2 === "" || localScore2 === undefined)) {
        return true;
      }
    } else if (context.tieGames === 2){
      if (localScore1 === "" || localScore2 === "" || 
      localScore1 === undefined || localScore2 === undefined){
        return true;
      }
    }
    return false;
  }

}