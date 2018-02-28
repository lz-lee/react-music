import React, {Component} from 'react'
import {connect} from 'react-redux'

import Switch from 'base/switch/switch'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/songlist/songlist'

import {Song} from 'common/js/song'

import {insertSong} from 'store/action'

import './user.styl'

class User extends Component{
  constructor(props) {
    super(props)
    this.state ={
      switches: [
        {
          name: '最近播放'
        },
        {
          name: '搜索历史'
        }
      ],
      currentIndex: 0
    }
    this.selectSong = this.selectSong.bind(this)
  }

  switch(i) {
    this.setState({
      currentIndex: i
    })
  }

  selectSong(v) {
    this.props.insertSong(new Song(v))
  }

  render() {
    return(
      <div className={"user-center" + (this.props.showUserCenter ? 'fade' : '')}>
        <div className="back">
          <i className="icon-back"></i>
        </div>
        <div className="switches-wrapper">
          <Switch 
            switches={this.state.switches}
            currentIndex={this.state.currentIndex}
            switch={this.switch}></Switch>
        </div>
        <div className="play-btn">
          <i className="icon-play"></i>
          <span className="text">随机播放全部</span>
        </div>
        <div className="list-wrapper">
          {
            this.state.currentIndex === 0
            ? 
            <Scroll
              className="list-scroll"
              probeType={3}
            >
              <div className="list-inner">
                <SongList songs={this.props.favoriteList} select={this.selectSong}></SongList>
              </div>
            </Scroll>
            :
            <Scroll
              className="list-scroll"
              probeType={3}
            >
              <div className="list-inner">
                <SongList songs={this.props.playHistory} select={this.selectSong}></SongList>
              </div>
            </Scroll>
          }
        </div>
      </div>
    )
  }
}

User = connect(state => state, {insertSong})(User)

export default  User