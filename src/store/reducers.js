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
      // 修改currentIndex的同时，提交currentSong
      const currentSong = state.playList[payload] || {}
      return {
        ...state,
        currentSong,
        currentIndex: payload
      }
    default:
      return state
  }
}

export function topList(state = initState.topList, action) {
  switch (action.type) {
    case types.SET_TOP_LIST:
      return {
        ...state,
        ...action.payload
      }
    default:
      return state
  }
}


export function searchHistory(state = initState.searchHistory, action) {
  switch (action.type) {
    case types.SET_SEARCH_HISTORY:
      return [...action.payload]
    default:
      return state
  }
}

export function playHistory(state = initState.playHistory, action) {
  switch (action.type) {
    case types.SET_PLAY_HISTORY:
      return [...action.payload]
    default:
      return state
  }
}

export function favoriteList(state = initState.favoriteList, action) {
  switch (action.type) {
    case types.SET_FAVORITE_LIST:
      return [...action.payload]
    default:
      return state
  }
}