import React from 'react'

function Combination(props) {

  const {combinations, index, size} = props


  const showResult = (result, local, visit) => {
    let team = {}
    if (result === 1) {
      team = local
    } else if (result === 2) {
      team = visit
    } else {
      return result
    }
    if (team.logo !== undefined) {
      return <img src={`./assets/logos/${team.logo}`} alt={team.abr} width="32px"></img>
    } else {
      return team.abr
    }
  }

  const getSize = () => {
    return combinations.otherStandings.length + 1
  }

  const showTeam = (team) => {
    if (team.logo !== undefined) {
      return <td key={team.abr}><img src={`./assets/logos/${team.logo}`} alt={team.abr} width="32px"></img></td>
    } else {
      return <td key={team.abr} style={{background: team.background, color: team.color}}>{team.abr}</td>
    }
  }

  const showSeparator = () => {
    if (index === 0) {
      return <td className="separator" rowSpan={size}></td>
    } else {
      return <></>
    }
  }

  return (
    <>
      {combinations.matches.map(match => <td rowSpan={getSize()} key={`${match.local.abr}-${match.visit.abr}`}>{showResult(match.result,match.local,match.visit)}</td>)}
      {showSeparator()}
      {combinations.standings.map(team => showTeam(team))}
    </>
  )
}

export default Combination
