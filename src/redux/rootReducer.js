import { combineReducers } from "redux"
import combinationReducer from './combination/combinationReducer'
import scoreReducer from "./score/scoreReducer"
import filterReducer from "./filter/filterReducer"

const rootReducers = combineReducers ({
    combination: combinationReducer,
    score: scoreReducer,
    filter: filterReducer
})

export default rootReducers
