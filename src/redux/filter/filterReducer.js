import { SET_FILTER } from './filterTypes'

const initialState = {
    fixtures: [],
    team: "",
    positions: []
}

const filterReducer = (state = initialState, action) => {
    switch(action.type){
        case SET_FILTER:
            return action.payload
        default:
            return state
    }
}

export default filterReducer
