import { ADD_COMBINATION, ADD_STANDINGS_TO_COMBINATION, ADD_OTHER_STANDINGS_TO_COMBINATION, MARK_COMBINATIONS_SAVED } from "./combinationTypes"

const initialState = {
    combinations: [],
    areSaved: false
}
const combinationReducer = (state = initialState, action) => {
  switch(action.type){
    case ADD_COMBINATION:
      return {
        combinations: [
          ...state.combinations,
          {matches: action.payload.matches,
          positions: action.payload.positions}
        ],
        areSaved: false
      }
    case ADD_STANDINGS_TO_COMBINATION:
      return {
        combinations: state.combinations.map((item,index)=> {

          if (index === action.payload.index) {
              return {
                  ...item,
                  standings: action.payload.standings
              }
          }
          return item;
        }),
        areSaved: state.areSaved
      }
      case ADD_OTHER_STANDINGS_TO_COMBINATION:
        return {
          combinations: state.combinations.map((item,index)=> {
  
            if (index === action.payload.index) {
                return {
                    ...item,
                    otherStandings: action.payload.otherStandings
                }
            }
            return item;
          }),
          areSaved: state.areSaved
        }
    case MARK_COMBINATIONS_SAVED:
      return {
        combinations: state.combinations,
        areSaved: true
      }
    default:
      return state
  }
}

export default combinationReducer