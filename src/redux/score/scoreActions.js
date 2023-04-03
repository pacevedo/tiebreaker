import { ADD_SCORE, UPDATE_SCORE, MARK_SCORES_SAVED } from './scoreTypes'

export const addScore = (score) => {
    return {
        type: ADD_SCORE,
        payload: score
    }
}

export const updateScore = (score) => {
    return {
        type: UPDATE_SCORE,
        payload: score
    }
}

export const markScoresSaved = () => {
    return {
        type: MARK_SCORES_SAVED
    }
}