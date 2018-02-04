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

export function player(state = initState.player, action) {
  const payload = action.payload
  switch (action.type) {
    case types.SET_PLAYING_STATE:
      return {
        ...state,
        playing: payload
      }
    case types.SET_FULL_SCREEN:
      return {
        ...state,
        fullScreen: payload
      }
    case types.SET_PLAYLIST:
      return {
        ...state,
        playList: payload
      }
    case types.SET_SEQUENCE_LIST:
      return {
        ...state,
        sequenceList: payload
      }
    case types.SET_PLAY_MODE:
      return {
        ...state,
        mode: payload
      }
    case types.SET_CURRENT_INDEX:
      return {
        ...state,
        currentIndex: payload
      }
    case types.SET_CURRENT_SONG:
      return {
        ...state,
        currentSong: {...state.currentSong, ...payload}
      }
    default:
      return state
  }
}