import React from 'react'
import {connect} from 'react-redux'

import MusicList from 'components/musicList/musicList'

import { getSingerDetail } from 'api/singer'
import { createSong, isValidMusic } from 'common/js/song'
import { CSSTransition } from 'react-transition-group'

import { ERR_OK } from 'api/config'

class SingerDetail extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      songList: [],
    }
  }

  componentDidMount() {
    this.setState({
      show: true
    })
    // 切换子路由的动画未做
    const {id} = this.props.match.params
    getSingerDetail(id).then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          songList: this._format(res.data.list)
        })
      }
    })
  }

  _format(list) {
    let ret = []
    list.forEach((item) => {
      const {musicData} = item
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }

  render() {
    const {id, name, avatar} = this.props.singer
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
          <MusicList title={name} bgImage={avatar} songs={this.state.songList} ></MusicList>
      </CSSTransition>
    )
  }
}

SingerDetail = connect(state => state)(SingerDetail)
export default SingerDetail