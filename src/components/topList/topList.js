import React from 'react'
import  {connect} from 'react-redux'

import MusicList from 'components/musicList/musicList'
import { getMusicList } from 'api/rank'
import { ERR_OK } from 'api/config'
import { createSong, isValidMusic } from 'common/js/song'
import { CSSTransition } from 'react-transition-group'

class TopList extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      show: false,
      songList: [],
      rank: true
    }
  }

  componentDidMount() {
    this.setState({
      show: true
    })
    const {id} = this.props.match.params
    getMusicList(id).then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          songList: this._format(res.songlist)
        })
      }
    })
  }

  _format(list) {
    let ret = []
    list.forEach((item) => {
      const musicData = item.data
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }
  

  render() {
    const {id, topTitle, picUrl} = this.props
    if (!id) {
      this.props.history.goBack()
      return null
    }
    return (
      <CSSTransition
        in={this.state.show}
        timeout={300}
        classNames="fade"
        >
          <MusicList title={topTitle} bgImage={picUrl} songs={this.state.songList} rank={this.state.rank}></MusicList>
      </CSSTransition>
    )
  }
}

export default connect(state => state.topList)(TopList)