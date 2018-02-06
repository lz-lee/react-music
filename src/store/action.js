import * as actions from './action-creator'

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
  const currentSong = list[index]
  return dispatch => {
    dispatch(actions.set_playList(list))
    dispatch(actions.set_sequenceList(list))
    dispatch(actions.set_currentIndex(index))
    dispatch(actions.set_fullScreen(true))
    dispatch(actions.set_playing(true))
    dispatch(actions.set_currentSong(currentSong))
  }
}
