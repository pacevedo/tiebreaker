import { Ties } from "../fixtures/ties";
import { Util } from "../utils/utils";
import store from "../../redux/store"
import { addOtherStandingsToCombination, addStandingsToCombination, markCombinationsSaved } from "../../redux/combination/combinationActions";
import { Constants } from "../utils/constants"


export const Standings = {

  /**
   * Set the standings for all the possible combinations
   */
  set: (combinations, scores, context) => {

    combinations.forEach((comb, index) => {
      const standings = Standings.get(comb, scores, context);
      // Update the combination in the store
      store.dispatch(addStandingsToCombination(index, standings))
      const otherStandings = Standings.getOtherPossibilities(comb, standings, scores, context)
      // Update the other possibilities in the store
      store.dispatch(addOtherStandingsToCombination(index, otherStandings))
    });
    store.dispatch(markCombinationsSaved())
  },

  /**
   * Retrieve the standings by a given combination
   */
  get: (combination, scores, context) => {
    const ties = Ties.getByCombination(combination.positions, context);
    const standings = Util.copy(combination.positions);
    ties.forEach(tie => {
      Standings.setByTie(tie, context, standings, scores, combination.matches, 0)
      Standings.setParticularsByTie(tie, context, standings, scores, combination.matches, 0)
    });
    standings.sort(Util.getOrderByCompetition(context.getCompetition()));
    return standings;
  },

  /**
   * Update the standing for a set of teams tied
   */
  setByTie: (tie, context, standings, scores, combinationMatches, i) => {
    const teamsTied = Util.toArr(tie)
    teamsTied.forEach(team1 => {
      teamsTied.forEach(team2  => {
        if (team1 !== team2){
          const match = Util.toStr([team1,team2], false);
          const standingsTeam1 = standings.filter(item => item.abr === team1);
          if (standingsTeam1.length === 1) {
            let particular1 = Standings.getParticularAverageByTeam(standingsTeam1[0], context, i)
            Standings.updateTeam(team1, scores, match, particular1, context, combinationMatches);
          }
          const standingsTeam2 = standings.filter(item => item.abr === team2);
          if (standingsTeam2.length === 1){
            let particular2 = Standings.getParticularAverageByTeam(standingsTeam2[0], context, i)
            Standings.updateTeam(team2, scores, match, particular2, context, combinationMatches);
          }
        }
      })
    })
  },

  /**
   * Update the particular average in standings
   */
  setParticularsByTie: (tie, context, standings, scores, combinationMatches, i) => {
    const teamsTied = Util.toArr(tie)
    if (teamsTied.length > 2) {
      let particulars = Standings.getTeamsWithParticularAverage(teamsTied,standings,context,i)
      // get ties
      if (!Standings.areAllTied(particulars, context)) {
        const particularTies = Ties.getByCombination(particulars, context)
        // set particular standings
        particularTies.forEach(particularTie => {
          Standings.setByTie(particularTie, context, standings, scores, combinationMatches, i+1)
          Standings.setParticularsByTie(particularTie, context, standings, scores, combinationMatches, i+1)
        });
      }
    }
  },

  areAllTied: (standings, context) => {
    standings.sort((a, b) => context.getElement(Constants.SCORE, b) - context.getElement(Constants.SCORE, a))
    return context.getElement(Constants.SCORE, standings[0]) === context.getElement(Constants.SCORE, standings[standings.length-1])
  },

  /**
   * Get the teams with the particular average by the index i
   */
  getTeamsWithParticularAverage: (teamsTied,standings, context, i) => {
    const teams = [];
    standings.forEach(item => {
      let team = {}
      if (teamsTied.includes(item.abr) && item.particular[i]) {
        team.name = item.name
        team.abr = item.abr
        team[context.getAttributeName(Constants.SCORE)] = context.getElement(Constants.SCORE, item.particular[i])
        team[context.getAttributeName(Constants.FAVOR)] = context.getElement(Constants.FAVOR, item.particular[i])
        team[context.getAttributeName(Constants.AGAINST)] = context.getElement(Constants.AGAINST, item.particular[i])
        team[context.getAttributeName(Constants.DIFFERENCE)] = context.getElement(Constants.DIFFERENCE, item.particular[i])
        teams.push(team)
      }
    })
    return teams
  },

  /**
   * Get the last particular average by a team. Initializes if not exists
   */
  getParticularAverageByTeam: (team, context, i) => {
    let particularAverage
    if (!team.particular) { 
      team.particular = []
    } 
    if (team.particular.length <= i){
      particularAverage = context.initParticular()
      team.particular.push(particularAverage)
    } else {
      particularAverage = team.particular[i]
    }
    return particularAverage
  },

  /**
   * Update the particular standings of a team after the match against another team
   */
  updateTeam: (team, scores, match, particularStandings, context, combinationMatches) => {
      const [local, visitor] = Util.toArr(match);
      const score = scores.filter(item => item.local === local && item.visit === visitor);
      if (score.length > 0 && score[0].localScore !== undefined){
          // Update particular standing from the scores finished
          const scoreTeam = context.getScoreTeam(team, score[0])
          context.updateStandingsTeam(scoreTeam, particularStandings)
      } else {
          // Update particular standing from the fixture of the combination
          const match = combinationMatches.filter(item => item.local.abr === local && item.visit.abr === visitor)
          if (match.length > 0) {
              const fixture = match[0].result
              const isLocal = team === local
              context.updateStandingsTeamFixture(fixture, isLocal, particularStandings)
          }
      }
  },

  /**
   * Get other possibilities for standings in a combination regarding pending matches
   */
  getOtherPossibilities: (comb, standings, scores, context) => {
    let otherPositions = []
    // Get positions of teams tied by score (depends on competition)
    const arrPositions = Ties.getPositionsTiedByCombination(standings, context, Util.isCompetitionRecursive(context.competition), -1)
    arrPositions.forEach(positions => {
      // get incomplete matches for these teams
      let incompleteMatches = Standings.getIncompleteMatches(positions, scores, context)
      
      // if there are incomplete matches
      if (incompleteMatches.length > 0) {
        // generate possibilities for the fixture in the combination (just changing differences)
        otherPositions.push({
          "teamsTied": positions,
          "totalStandings": context.generatePossibilities(incompleteMatches, comb, standings)
        })
      }
    })
    // combine other positions
    return Standings.combinePositions(otherPositions, standings)
  },

  /**
   * Get the matches that don't have a result
   */
  getIncompleteMatches: (standings, scores, context) => {
    let incompleteMatches = [];
    for (let i = 0; i < standings.length; i++) {
      for (let j = i + 1; j < standings.length; j++) {
        const team1 = standings[i];
        const team2 = standings[j];
        const matches = Standings.getMatches(team1, team2, scores);
        if (Ties.isTieBreakerIncomplete(matches, context)) {
          incompleteMatches.push({ team1, team2 });
        }
      }
    }
    return incompleteMatches;
  },

  /**
   * Get the matches between two teams
   */
  getMatches: (team1, team2, scores) => {
    const match1 = scores.filter(item => item.local === team1.abr && item.visit === team2.abr)[0]
    const match2 = scores.filter(item => item.local === team2.abr && item.visit === team1.abr)[0]
    return [match1, match2]
  },

  combinePositions: (otherPositions, standings) => {
    if (otherPositions.length === 1) {
      return otherPositions[0].totalStandings
    } else {
      let result = []
      let lengths = []
      let indexesCombinated = []
      // Include standings in every other positions
      otherPositions.forEach(arrPositions => {
        result.push(...arrPositions.totalStandings)
        arrPositions.totalStandings.unshift(standings)
        // Set array with lengths
        lengths.push(arrPositions.totalStandings)
      })
      // set combinations
      indexesCombinated = Standings.getIndexesCombinated(lengths)
      // remove duplicated combinations
      Standings.removeDuplicatedCombinations(indexesCombinated)
      // Combine 
      indexesCombinated.forEach(indexes => {
        let positions = []
        indexes.forEach((index, i) => {
          positions.push({
            "teamsTied": otherPositions[i].teamsTied,
            "standings": otherPositions[i].totalStandings[index]
          })
        })
        result.push(Standings.combine(positions, standings))
      })
      return result
    }
    
  },

  getIndexesCombinated: (arr) => {
    if (arr.length === 0) {
      return [[]];
    } else {
      const result = [];
      const rest = Standings.getIndexesCombinated(arr.slice(1));
      for (let i = 0; i < rest.length; i++) {
        for (let j = 0; j < arr[0]; j++) {
          result.push([j, ...rest[i]]);
        }
      }
      return result;
    }
  },

  /**
   * Remove combinations that are already calculated
   */
  removeDuplicatedCombinations: (arrIndexes) => {
    let indexesToRemove = []
    arrIndexes.forEach((combination, index) => {
      // Get the "zeros" that would be the initial standings
      const zerosCount = combination.filter(num => num === 0).length;
      // If every combination has initial standings but one (or every combination has initial standings) we have to remove it
      if (zerosCount >= combination.length - 1) {
        indexesToRemove.push(index)
      }
    })
    indexesToRemove.forEach(indexToRemove => {
      arrIndexes.splice(indexToRemove)
    })
  },

  /**
   * Combine differents standings
   */
  combine: (positions, standings) => {
    let newPositions = []
    positions.forEach(combinationStandings => {
      let boundaries = Standings.getBoundariesTeamsTied(combinationStandings.teamsTied, standings)
      for (let i=boundaries.top; i<=boundaries.bottom; i++) {
        newPositions[i] = combinationStandings.standings[i]
      }
    })
    // Iterate newPositions to set positions of initial standings in empty positions
    for (let i=0; i < standings.length; i++) {
      if (newPositions[i] === undefined) {
        newPositions[i] = standings[i]
      }
    }
    return newPositions
  },

  /**
   * Get the max index and the min index in the standings of the teams tied
   */
  getBoundariesTeamsTied: (teamsTied, standings) => {
    let positions = []
    standings.forEach((team, index) => {
      if (teamsTied.filter(element => element.abr === team.abr).length > 0) {
        positions.push(index)
      }
    })
    positions.sort(function(a, b){return a-b})
    return {
      top: positions[0],
      bottom: positions[positions.length-1]
    }
  }
}
