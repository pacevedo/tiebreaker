import React from 'react'
import { data } from '../data/data'

function CombinationHeader(props) {
  const combinations = props.combinations;
  const initPosition = data.initPosition;
  const lengthArray = combinations.positions.length;
  const positions = Array.from({length: lengthArray}, (v, k) => k+initPosition); 
  const showMatch = (match) => {
    if (match.local.logo !== undefined && match.visit.logo !== undefined) {
      return <React.Fragment key={`fragment-${match.local.abr}-${match.visit.abr}`}><img src={`./assets/logos/${match.local.logo}`} alt={match.local.abr} width="24px"></img>  
      <img src={`./assets/logos/${match.visit.logo}`} alt={match.visit.abr} width="24px"></img></React.Fragment>
    } else {
      return `${match.local.abr} - ${match.visit.abr}`
    }
  }
  return (
    <>
      {combinations.matches.map(match => <th key={`${match.local.abr}-${match.visit.abr}`}>{showMatch(match)}</th>)}
      <th className="separator"></th>
      {positions.map(position => <th key={position}>{position}º</th>)}
    </>
  )
}

export default CombinationHeader
