import React, {Component} from 'react'
import {connect} from 'react-redux'

import {CSSTransition} from 'react-transition-group'

import Switch from 'base/switch/switch'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/songlist/songlist'
import NoResult from 'base/noResult/noResult';

import {Song} from 'common/js/song'

import {insertSong, randomPlay} from 'store/action'

import './user.styl'

class User extends Component{
  constructor(props) {
    super(props)
    this.state ={
      showFlag: false,
      switches: [
        {
          name: '我喜欢的'
        },
        {
          name: '最近听的'
        }
      ],
      currentIndex: 0
    }
    this.selectSong = this.selectSong.bind(this)
    this.back = this.back.bind(this)
    this.switch = this.switch.bind(this)
    this.random = this.random.bind(this)
  }

  componentDidMount() {
    this.setState({
      showFlag: true
    })
  }

  shouldComponentUpdate(nextProps, nextState) {
    const bottom = nextProps.player.playList.length > 0 ? '60px' : 0
    this.refs.listWrapper.style.bottom = bottom
    this.refs.favoriteList && this.refs.favoriteList.refresh()
    this.refs.playList && this.refs.playList.refresh()
    return true
  }

  switch(i) {
    this.setState({
      currentIndex: i
    })
  }

  selectSong(v) {
    this.props.insertSong(new Song(v))
  }

  back() {
    this.props.history.goBack()
  }

  random() {
    let list = this.state.currentIndex === 0? this.props.favoriteList : this.props.playHistory
    if (list.length === 0) {
      return
    }
    list = list.map(v => (new Song(v)))
    this.props.randomPlay({list})
  }

  render() {
    const noResultDesc = this.state.currentIndex === 0 ? '暂无收藏歌曲' : '你还没有听过歌曲'
    const showNoResult = this.state.currentIndex === 0 ? !this.props.favoriteList.length : !this.props.playHistory.length
    return(
      <CSSTransition
        in={this.state.showFlag}
        timeout={200}
        classNames="fade">
        <div className="user-center">
          <div className="back" onClick={this.back}>
            <i className="icon-back"></i>
          </div>
          <div className="switches-wrapper">
            <Switch
              switches={this.state.switches}
              currentIndex={this.state.currentIndex}
              switch={this.switch}></Switch>
          </div>
          <div className="play-btn" onClick={this.random}>
            <i className="icon-play"></i>
            <span className="text">随机播放全部</span>
          </div>
          <div className="list-wrapper" ref="listWrapper">
            {
              this.state.currentIndex === 0
              ?
              <Scroll
                ref="favoriteList"
                className="list-scroll"
                probeType={3}
              >
                <div className="list-inner">
                  <SongList songs={this.props.favoriteList} select={this.selectSong}></SongList>
                </div>
              </Scroll>
              :
              <Scroll
                ref="playList"
                className="list-scroll"
                probeType={3}
              >
                <div className="list-inner">
                  <SongList songs={this.props.playHistory} select={this.selectSong}></SongList>
                </div>
              </Scroll>
            }
          </div>
          <div className="no-result-wrapper" style={{'display': showNoResult ? 'block' : 'none'}}>
            <NoResult title={noResultDesc}></NoResult>
          </div>
        </div>
      </CSSTransition>
    )
  }
}

User = connect(state => state, {insertSong, randomPlay})(User)

export default  User