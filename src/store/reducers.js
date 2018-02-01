import initState from './state'
import * as types from './action-types'

export function disc(state = initState.disc, action) {
  console.log(action)
  switch (action.type) {
    case types.SET_DISC:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}

export function singer(state = initState.singer, action) {
  switch (action.type) {
    case types.SET_SINGER:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}