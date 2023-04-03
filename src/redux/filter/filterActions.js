import { SET_FILTER } from './filterTypes'

export const setFilter = (filter) => {
    return {
        type: SET_FILTER,
        payload: filter
    }
}