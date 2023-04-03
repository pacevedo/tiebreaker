import React from 'react'
import Match from './match';
import { useDispatch, useSelector } from 'react-redux';
import { markScoresSaved } from '../../redux/score/scoreActions';
import { Standings } from '../standings/standings';

function Fixtures(props) {

    const matches = props.matches
    const context = props.context

    const combinations = props.combinations
    const score = useSelector(state => state.score)

    const dispatch = useDispatch()
    

    const showCombinationTable = (event) => {
        event.preventDefault()
        Standings.set(combinations, score.scores, context);
        dispatch(markScoresSaved())
    }

    const fixtures = matches => {
        
        return (
            <tbody>
            {
                (matches.length>0) 
                ? matches.map((match, index) => <Match key={index} match={match} />)
                : <tr><td></td></tr>
            }
        </tbody>  
        )
    }

    return (
        <div id="tiebreakers">
            <form onSubmit={showCombinationTable}>
                <table>
                {fixtures(matches)}
                </table>
                <input type='submit' value="Send"/>
            </form>
        </div>
    )
}

export default Fixtures
