import * as types from './action-types'

export const set_Disc = disc => ({
  type: types.SET_DISC,
  payload: disc
})

export const set_singer = singer => ({
  type: types.SET_SINGER,
  payload: singer
})

export const set_playing = playing => ({
  type: types.SET_PLAYING_STATE,
  payload: playing
})

export const set_fullScreen = flag => ({
  type: types.SET_FULL_SCREEN,
  payload: flag
})

export const set_playList = list => ({
  type: types.SET_PLAYLIST,
  payload: list
})

export const set_sequenceList = list => ({
  type: types.SET_SEQUENCE_LIST,
  payload: list
})

export const set_playMode = mode => ({
  type: types.SET_PLAY_MODE,
  payload: mode
})

export const set_currentIndex = index => ({
  type: types.SET_CURRENT_INDEX,
  payload: index
})

export const setTopList = item => ({
  type: types.SET_TOP_LIST,
  payload: item
})

export const setSearchHistory = list => ({
  type: types.SET_SEARCH_HISTORY,
  payload: list
})

export const setPlayHistory = list => ({
  type: types.SET_PLAY_HISTORY,
  payload: list
})

export const setFavorite = list => ({
  type: types.SET_FAVORITE_LIST,
  payload: list
})