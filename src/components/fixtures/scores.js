import store from "../../redux/store"
import { Util } from "../utils/utils"
import { updateScore } from '../../redux/score/scoreActions'

export const Scores = {

    scores: () => store.getState().score.scores,
    

    /**
     * Gets the score of a match among the scores given
     * @param {*} localTeam 
     * @param {*} visitorTeam 
     */
    getScore: (scores, localTeam, visitorTeam) => {
        return scores.filter(item => item.local === localTeam && item.visit === visitorTeam)[0]
    },

    changeScore: (match, score) => {
        const aux = Util.toArr(match);
        if (aux.length === 3) {
            const [place, local, visitor] = aux;
            const prevScore = Scores.getScore(Scores.scores(),local,visitor);
            let item = {}
            if (place === "local"){
                item = {local: local, visit: visitor, localScore: +score, visitorScore: prevScore.visitorScore}
            } else if (place === "visit"){
                item = {local: local, visit: visitor, localScore: prevScore.localScore, visitorScore: +score}
            }
            store.dispatch(updateScore(item))
        }
    }
}