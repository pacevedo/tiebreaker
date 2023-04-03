import { ADD_COMBINATION, ADD_STANDINGS_TO_COMBINATION, ADD_OTHER_STANDINGS_TO_COMBINATION, MARK_COMBINATIONS_SAVED } from "./combinationTypes"

export const addCombination = (combination) => {
    return {
        type: ADD_COMBINATION,
        payload: combination
    }
}

export const addStandingsToCombination = (index, standings) => {
    return {
        type: ADD_STANDINGS_TO_COMBINATION,
        payload: {
            index: index,
            standings: standings
        }
    }
}

export const addOtherStandingsToCombination = (index, otherStandings) => {
    return {
        type: ADD_OTHER_STANDINGS_TO_COMBINATION,
        payload: {
            index: index,
            otherStandings: otherStandings
        }
    }
}

export const markCombinationsSaved = () => {
    return {
        type: MARK_COMBINATIONS_SAVED
    }
}

