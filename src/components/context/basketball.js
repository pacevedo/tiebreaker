import { Sport } from './sport'
import { Constants } from "../utils/constants"

export class Basketball extends Sport{

  maxScoringDifference = 10

  initParticular(){
    return {
      wins: 0, 
      pointsFavor: 0,
      pointsAgainst: 0,
      difference: 0
    }
  }

  getAttributeName(tipo){
    let element;
    switch(tipo) {
      case Constants.SCORE:
        element = "wins"
        break;
      case Constants.FAVOR:
        element = "pointsFavor";
        break;
      case Constants.AGAINST:
        element = "pointsAgainst";
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
          standings.wins++
      }
      standings.pointsFavor += scoreTeam.favor
      standings.pointsAgainst += scoreTeam.against
      standings.difference = standings.pointsFavor - standings.pointsAgainst
  }

  updateStandingsTeamFixture (fixture, isLocal, standings){
      if (fixture === 1 && isLocal){
          standings.wins++
      }
      if (fixture === 2 && !isLocal){
          standings.wins++
      }
  }

  getMaxScoringDifference () {
    return this.maxScoringDifference
  }

}