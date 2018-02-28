import * as actions from './action-creator'
import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'
import {saveSearch, deleteSearch, clearSearch, savePlay, saveFavorite, deleteFavorite} from 'common/js/cache'

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

export function insertSong(song) {
  return (dispatch, getState) => {
    let state = getState().player
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    let currentSong = playList[currentIndex]
    // 查找当前列表是否有此song 并返回index
    let fIndex = findIndex(playList, song)

    // 插入 索引+ 1
    currentIndex++
    // 在当前播放歌曲处插入
    playList.splice(currentIndex, 0, song)
    // 如果包含这首歌
    if (fIndex > -1) {
      if (currentIndex > fIndex) {
        // [1, 2, 3, 4 (在这里插入)] ==> [1, 2, 3, 4, 2] ==> [1, 3, 4, 2]
        playList.splice(fIndex, 1)
        currentIndex--
      } else {
        // [1, (在这里插入)3, 4, 2] ==> [1, 2, 3, 4, 2] ===> [1, 2, 3, 4]
        playList.splice(fIndex + 1, 1)
      }
    }
    // sequenceList 要插入的位置
    let currentSIndex = findIndex(sequenceList, currentSong) + 1
    // 查找song 的位置
    let fsIndex = findIndex(sequenceList, song)
    sequenceList.splice(currentSIndex, 0, song)

    if (fsIndex > -1) {
      if (currentSIndex > fsIndex) {
        sequenceList.splice(fsIndex, 1)
      } else {
        sequenceList.splice(fsIndex + 1, 1)
      }
    }

    dispatch(actions.set_playList(playList))
    dispatch(actions.set_sequenceList(sequenceList))
    dispatch(actions.set_currentIndex(currentIndex))
    dispatch(actions.set_fullScreen(true))
    dispatch(actions.set_playing(true))
  }
}

export function deleteSong(song) {
  return (dispatch, getState) => {
    let state = getState().player
    let playList = state.playList.slice()
    let sequenceList = state.sequenceList.slice()
    let currentIndex = state.currentIndex

    let fIndex = findIndex(playList, song)
    playList.splice(fIndex, 1)
    let fsIndex = findIndex(sequenceList, song)
    sequenceList.splice(fsIndex, 1)

    if (currentIndex > fIndex || currentIndex === playList.length) {
      currentIndex--
    }
    dispatch(actions.set_playList(playList))
    dispatch(actions.set_sequenceList(sequenceList))
    dispatch(actions.set_currentIndex(currentIndex))

    if (!playList.length) {
      dispatch(actions.set_playing(false))
    } else {
      dispatch(actions.set_playing(true))
    }
  }
}

export function deleteSonglist() {
  return dispatch => {
    dispatch(actions.set_currentIndex(-1))
    dispatch(actions.set_playList([]))
    dispatch(actions.set_sequenceList([]))
    dispatch(actions.set_playing(false))
  }
}

export function saveSearchHistory(query) {
  return dispatch => {
    dispatch(actions.setSearchHistory(saveSearch(query)))
  }
}

export function deleteSearchHistory(query) {
  return dispatch => {
    dispatch(actions.setSearchHistory(deleteSearch(query)))
  }
}

export function clearSearchHistory(query) {
  return dispatch => {
    dispatch(actions.setSearchHistory(clearSearch()))
  }
}

export function savePlayHistory(song) {
  return dispatch => {
    dispatch(actions.setPlayHistory(savePlay(song)))
  }
}

export function deleteFavoriteList(song) {
  return dispatch => {
    dispatch(actions.setFavorite(deleteFavorite(song)))
  }
}

export function saveFavoriteList(song) {
  return dispatch => {
    dispatch(actions.setFavorite(saveFavorite(song)))
  }
}

function findIndex(list, song) {
  return list.findIndex((item) => {
    return item.id === song.id
  })
}