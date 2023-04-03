export class Sport {

  getScoreTeam(team, score){
    const scoreTeam = {favor: 0, against: 0};
    if (team === score.local) {
      scoreTeam.favor = score.localScore
      scoreTeam.against = score.visitorScore
    } else {
      scoreTeam.favor = score.visitorScore
      scoreTeam.against = score.localScore
    }
    return scoreTeam;
  }

  initParticular(){
      
  }

  getAttributeName(tipo) {
      
  }

  getElement(tipo, item){
    return item[this.getAttributeName(tipo)]
  }

  updateStandingsTeam (scoreTeam, standings){
      
  }

  updateStandingsTeamFixture (fixture, isLocal, standings){

  }

  generatePossibilities (incompleteMatches, standings) {

  }

}