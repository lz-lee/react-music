import {playMode} from 'common/js/config'
import {loadSearch} from 'common/js/cache'

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
  searchHistory: loadSearch()
}
export default state