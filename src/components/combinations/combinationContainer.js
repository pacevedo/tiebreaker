import React from 'react'
import Combination from './combination'
import CombinationHeader from './combinationHeader'
import { useSelector } from 'react-redux'
import { data } from '../data/data'

function CombinationContainer() {

  const score = useSelector(state => state.score)
  const combinations = useSelector(state => state.combination)
  const filter = useSelector(state => state.filter)

  const {fixtures, team, positions} = filter

  let showCombinations = <></>

  const isFixture = (result, fixture) => {
    return fixture === "" || parseInt(fixture) === result
  }

  if (score && score.areSaved && combinations && combinations.areSaved) {
    // Get by filters
    const combinationsFiltered = combinations.combinations.filter(combination => {
      const {matches, standings} = combination
      // Filter of fixtures
      if (fixtures.length === matches.length) {
        const results = matches.map(match => match.result)
        const numFixtures = results.filter((result,index) => isFixture(result,fixtures[index]))
        if (numFixtures.length !== matches.length) {
          return false
        }
      }
      // Filter of positions by team
      if (team !== ""){
        const position = standings.findIndex(element => element.abr === team)
        if (positions.length > 0) {
          const positionNumbers = positions.map(position => parseInt(position))
          if (!positionNumbers.includes(position + data.initPosition)){
            return false
          }
        }
      }
      return true
    })

    const getOtherStandings = (otherStandings, i) => {
      if (otherStandings.length > 0) {
        return otherStandings.map((possibility, index) => {
          return <tr key={`others-${i}-${index}`}>
            {possibility.map(team => <td key={team.abr} style={{background: team.background, color: team.color}}>{team.abr}</td>)}
          </tr>
        })
      } else {
        return <></>
      }
    }



    showCombinations =
      <table id="combinations">
        <thead>
          <tr>
            <CombinationHeader combinations={combinations.combinations[0]}/>
          </tr>
        </thead>
        <tbody>
          {combinationsFiltered.map((combination, index) => 
            <React.Fragment key={index}>
              <tr key={index}><Combination combinations={combination} index={index} size={combinationsFiltered.length}/></tr>
              {getOtherStandings(combination.otherStandings, index)}
            </React.Fragment>
          )}     
        </tbody>
      </table> 
  } else if (score && score.areSaved) {
    showCombinations = <>Loading</> 
  }

  return showCombinations
}

export default CombinationContainer
