import React from 'react'
import { Util } from '../utils/utils';
import { Scores } from './scores';
import { data } from '../data/data';

function Match(props) {
    let aux = Util.toArr(props.match);

    const local = aux[0]
    const visitor = aux[1]

    const localName = "local-"+props.match
    const visitorName = "visit-"+props.match

    const score = Scores.getScore(data.scores, local,visitor)

    const {localScore, visitorScore} = (score) ? score : {localScore:"",visitorScore:""}

    const changeScore = (event) => {
        Scores.changeScore(event.target.name, event.target.value);
    }
    
    return (
        <tr>
            <td>{local}</td>
            <td><input type='text' name={localName} className="resultado" defaultValue={localScore} onChange={changeScore}/></td>
            <td><input type='text' name={visitorName} className="resultado" defaultValue={visitorScore} onChange={changeScore}/></td>
            <td>{visitor}</td>
        </tr>
    );

}

export default Match
