export const data = require ('../../assets/dataset/Euroleague/data18-19.json');

export let matches = []
data.pendingMatches.forEach(item => {
  let match = {}
  let localTeamArr = data.teams.filter(team => team.abr === item.local)
  let otherLocalTeamArr = data.others.filter(team => team.abr === item.local)
  let visitTeamArr = data.teams.filter(team => team.abr === item.visit)
  let otherVisitTeamArr = data.others.filter(team => team.abr === item.visit)
  match.local = localTeamArr.length > 0 ? localTeamArr[0] : otherLocalTeamArr[0]
  match.visit = visitTeamArr.length > 0 ? visitTeamArr[0] : otherVisitTeamArr[0]
  matches.push(match)
})



