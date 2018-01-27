import initState from './state'
import * as types from './action-types'

export function disc(state = initState, action) {
  console.log(action)
  switch (action.type) {
    case types.SET_DISC:
      return {
        ...state,
        disc: action.payload
      }
    default:
      return state
  }
}