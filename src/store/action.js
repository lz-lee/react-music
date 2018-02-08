import * as actions from './action-creator'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export function setDisc(data) {
  return dispatch => {
    dispatch(actions.set_Disc(data))
  }
}

export function setSinger(data) {
  return dispatch => {
    dispatch(actions.set_singer(data))
  }
}

export function selectPlay({list, index}) {
  return dispatch => {
    dispatch(actions.set_playList(list))
    dispatch(actions.set_sequenceList(list))
    dispatch(actions.set_currentIndex(index))
    dispatch(actions.set_fullScreen(true))
    dispatch(actions.set_playing(true))
  }
}


export function randomPlay({list}) {
  let randomList = shuffle(list)
  return dispatch => {
    dispatch(actions.set_playMode(playMode.random))
    dispatch(actions.set_sequenceList(list))
    dispatch(actions.set_playList(randomList))
    dispatch(actions.set_currentIndex(0))
    dispatch(actions.set_fullScreen(true))
    dispatch(actions.set_playing(true))
  }
}