import React from 'react'
import {connect} from 'react-redux'

import MusicList from 'components/musicList/musicList'

import { ERR_OK } from 'api/config'
import { getSongList } from 'api/recommend'
import { createSong, isValidMusic } from 'common/js/song'
import { CSSTransition } from 'react-transition-group'

class Disc extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      refresh: false,
      songList: [],
    }
  }

  componentDidMount() {
    this.setState({
      show: true
    })
    // 切换子路由的动画未做
    const {id} = this.props.match.params
    getSongList(id).then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          songList: this._format(res.cdlist[0].songlist)
        }, () => {
          this.setState({
            refresh: true
          })
        })
      }
    })
  }

  _format(list) {
    let ret = []
    list.forEach((musicData) => {
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }

  render() {
    const {disc:{dissname, imgurl, dissid}} = this.props
    if (!dissid) {
      this.props.history.goBack()
      return null
    }
    return (
      <CSSTransition
        in={this.state.show}
        timeout={300}
        classNames="fade"
        >
          <MusicList title={dissname} bgImage={imgurl} songs={this.state.songList} ></MusicList>
      </CSSTransition>
    )
  }
}

Disc = connect(state => state.disc)(Disc)

export default Disc
