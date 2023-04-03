import { ADD_SCORE, UPDATE_SCORE, MARK_SCORES_SAVED } from "./scoreTypes"

const initialState = {
    scores: [],
    areSaved: false
}

const scoreReducer = (state = initialState, action) => {
    switch(action.type){
        case ADD_SCORE:
            return {
                scores: [ ...state.scores,action.payload],
                areSaved: false
            }
        case UPDATE_SCORE:
            return {
                scores: state.scores.map(item => {
                    if (item.local === action.payload.local && item.visit === action.payload.visit){
                        return action.payload
                    }
                    return item;
                }),
                areSaved: false
            }
        case MARK_SCORES_SAVED:
            return {
                scores: state.scores,
                areSaved: true
            }
        default:
            return state
    }       
}

export default scoreReducer