import { Constants } from "../utils/constants"
import { Football } from "./football"
import { Basketball } from "./basketball"
import { Util } from "../utils/utils";

export class Context {
  constructor(sport, competition, tieGames){
    switch(sport) {
      case Constants.FOOTBALL:
        this.strategy = new Football()
        break
      case Constants.BASKETBALL:
        this.strategy = new Basketball()
        break
      default:
        this.strategy = new Football()
    }
    this.competition = competition
    this.tieGames = tieGames
  }

  initParticular(){
    return this.strategy.initParticular()
  }

  getAttributeName(tipo) {
    return this.strategy.getAttributeName(tipo)
  }

  getElement(tipo, item){
    return this.strategy.getElement(tipo, item)
  }

  getCompetition(){
    return this.competition
  }

  getScoreTeam(team, score){
    return this.strategy.getScoreTeam(team, score)
  }

  updateStandingsTeam (scoreTeam, standings){
    this.strategy.updateStandingsTeam(scoreTeam, standings)
  }

  updateStandingsTeamFixture (fixture, isLocal, standings){
    this.strategy.updateStandingsTeamFixture(fixture, isLocal, standings)
  }

  generatePossibilities (incompleteMatches, comb, standings) {
    const matches = incompleteMatches.map(incompleteMatch => comb.matches.filter(item => Util.filterMatchFromCombination(item, incompleteMatch))[0])
    let otherPositions = []
    let arrDifferences = []
    const maxPossibilities = Math.pow(this.strategy.getMaxScoringDifference(),matches.length)
    for (let i=0; i<=maxPossibilities; i++) {
      arrDifferences = []
      for (let j = matches.length-1; j > 0; j--) {
        let divisor = Math.pow(this.strategy.getMaxScoringDifference(),j)
        arrDifferences.push((Math.trunc(i/divisor)%divisor)+1)
      }
      arrDifferences.push((i%this.strategy.getMaxScoringDifference())+1)
      let arrPossibility = Util.copy(standings)
      for(let k = 0; k<matches.length; k++){
        if (k < arrDifferences.length) {
          this.setPossibility(matches[k], arrPossibility, arrDifferences[k])
          arrPossibility.sort(Util.getOrderByCompetition(this.competition))
        }
      }
      // if different positions arrPossibility from standings, add new other position
      if (!Util.isSameOrder(arrPossibility,standings) && !Util.existsSameOrder(arrPossibility, otherPositions)) {
        otherPositions.push(arrPossibility)
      }
    }
    return otherPositions
  }

  setPossibility(match, arrPossibility, i) {
    const indexLocal = arrPossibility.findIndex(item => item.abr === match.local.abr)
    const indexVisit = arrPossibility.findIndex(item => item.abr === match.visit.abr)
    if (match.result === 1) {
      this.incrementParticularDifference(arrPossibility[indexLocal], i)
      this.incrementParticularDifference(arrPossibility[indexVisit], -i)
    } else if (match.result === 2){
      this.incrementParticularDifference(arrPossibility[indexLocal], -i)
      this.incrementParticularDifference(arrPossibility[indexVisit], i)
    }
  }

  incrementParticularDifference(team, diff) {
    if (!Util.isCompetitionRecursive(this.competition)) {
      team.particular[0].difference += diff
    } else {
      team.particular[team.particular.length-1].difference += diff
    }
  }
}

