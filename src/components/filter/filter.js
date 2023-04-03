import React from 'react'
import { data, matches } from '../data/data'
import { useForm } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import { setFilter } from '../../redux/filter/filterActions';


function Filter() {

  const { register, handleSubmit } = useForm();
  const dispatch = useDispatch()

  const onSubmit = data => {
    dispatch(setFilter(data))
  }

  const fixtures = data.possibleFixtures.map(fixture => <option key={fixture} value={fixture}>{fixture}</option>)

  const printMatch = (match, index) => {
    const name = `fixtures[${index}]`
    return (
      <tr key={index}>
        <td>
          <label>{match.local.name}</label> - <label>{match.visit.name}</label>
        </td>
        <td>
          <select name={name} ref={register}>
            <option value=""></option>
            {fixtures}
          </select>
        </td>
      </tr>
    )
  }

  const printMatches = matches.map((match, index) => printMatch(match, index))
  const printTeams = data.teams.map(team => <option key={team.abr} value={team.abr}>{team.name}</option>)
  const initPosition = data.initPosition;
  const lengthArray = data.teams.length;
  const positions = Array.from({length: lengthArray}, (v, k) => k+initPosition);
  const printPositions = positions.map(position => <React.Fragment key={position}><input type="checkbox" name="positions" ref={register} value={position} /><label>{position}º</label></React.Fragment>)

  return (
    <div id="filter">
      <h3>Filter</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <table>
            <tbody>
              {printMatches}
            </tbody>
          </table>
        </div>
        <div>
          <select name="team" ref={register}>
            <option value="">Select</option>
            {printTeams}
          </select>
          {printPositions}
        </div>
        <input type='submit' value='Filter'/>
      </form>
    </div>
  )
}

export default Filter
