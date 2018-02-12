import {playMode} from 'common/js/config'

const state = {
  disc: {},
  singer: {},
  player: {
    playing: false,
    fullScreen: false,
    playList: [],
    sequenceList: [],
    mode: playMode.sequence,
    currentIndex: -1,
    currentSong: {}
  },
  topList: {},
  searchHistory: []
}
export default state 