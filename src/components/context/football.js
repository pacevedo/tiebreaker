import { Sport } from './sport'
import { Constants } from "../utils/constants"

export class Football extends Sport{

  maxScoringDifference = 10

  initParticular(){
    return {
      points: 0,
      goalsFavor: 0,
      goalsAgainst: 0,
      difference: 0
    }
  }

  getAttributeName(tipo){
    let element;
    switch(tipo) {
      case Constants.SCORE:
        element = "points"
        break;
      case Constants.FAVOR:
        element = "goalsFavor";
        break;
      case Constants.AGAINST:
        element = "goalsAgainst";
        break;
      case Constants.DIFFERENCE:
        element = "difference";
        break;
      default:
          break;
    }
    return element;
  }

  updateStandingsTeam (scoreTeam, standings){
    if (scoreTeam.favor > scoreTeam.against){
        standings.points+=3;
    } else if (scoreTeam.favor === scoreTeam.against) {
        standings.points++;
    }
    standings.goalsFavor += scoreTeam.favor
    standings.goalsAgainst += scoreTeam.against
    standings.difference = standings.goalsFavor - standings.goalsAgainst
  }

  updateStandingsTeamFixture (fixture, isLocal, standings){
    if (fixture === 1 && isLocal){
        standings.points += 3
    }
    if (fixture === 2 && !isLocal){
        standings.points += 3
    }
    if (fixture === "X"){
        standings.points++
    }
  }

  getMaxScoringDifference () {
    return this.maxScoringDifference
  }
}