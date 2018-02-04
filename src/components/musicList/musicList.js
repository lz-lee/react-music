import React from 'react'
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/songlist/songlist'
import {prefix} from 'common/js/prefix'

import {selectPlay} from 'store/action'

import './musicList.styl'

const RESERVED_HEIGHT = 40
const transform = prefix('transform')
const backdrop = prefix('backdrop-filter')

class MusicList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      scrollY: 0
    }
    this.back = this.back.bind(this)
    this.random = this.random.bind(this)
    this.onScroll = this.onScroll.bind(this)
    this.selectSong = this.selectSong.bind(this)
  }

  static propTypes = {
    title: PropTypes.string,
    bgImage: PropTypes.string,
    songs: PropTypes.array,
    rank: PropTypes.bool
  }

  static defaultProps = {
    title: '',
    bgImage: '',
    songs: [],
    rank: false
  }

  back() {
    this.props.history.goBack()
  }

  selectSong(song, index) {
    this.props.selectPlay && this.props.selectPlay({
      list: this.props.songs,
      index
    })
  }

  random() {

  }

  onScroll(scroll) {
    let y = scroll.y
    let translateY = Math.max(this.minTranslateY, y)
    let scale = 1
    let zIndex = 0
    let blur = 0
    const percent = Math.abs(y / this.imageHeight)
    if (y > 0) {
      scale = 1 +percent
      zIndex = 10
    } else {
      blur = Math.min(20, percent * 20)
    }
    this.refs.layer.style[transform] = `translate3d(0,${translateY}px, 0)`
    this.refs.filter.style[backdrop] = `blur(${blur}px)`
    if (y < this.minTranslateY) {
      zIndex = 10
      this.refs.bgImage.style.paddingTop = 0
      this.refs.bgImage.style.height = `${RESERVED_HEIGHT}px`
      this.refs.playBtn.style.display = 'none'
    } else {
      this.refs.bgImage.style.paddingTop = '70%'
      this.refs.bgImage.style.height = 0
      this.refs.playBtn.style.display = ''
    }
    this.refs.bgImage.style[transform] = `scale(${scale})`
    this.refs.bgImage.style.zIndex = zIndex
  }

  componentDidMount() {
    this.imageHeight = this.refs.bgImage.clientHeight
    this.minTranslateY = -this.imageHeight + RESERVED_HEIGHT
    this.refs.list.style.top = `${this.imageHeight}px`
  }
  
  render() {
    return (
      <div className="music-list">
        <div className="back" onClick={this.back}>
          <i className="icon-back"></i>
        </div>
        <div className="title">{this.props.title}</div>
        <div
          ref="bgImage"
          className="bg-image"
          style={{backgroundImage: `url(${this.props.bgImage})`}}>
            <div className="play-wrapper">
              {this.props.songs.length ?
                <div 
                ref="playBtn"
                onClick={this.random}
                className="play">
                  <i className="icon-play"></i>
                  <span className="text">随机播放全部</span>
                </div> : null}
            </div>
            <div className="filter" ref="filter"></div>
        </div>
        <div className="bg-layer" ref="layer"></div>
        <div
          ref="list"
          className="list">
          <Scroll
            probeType={3}
            data={this.props.songs}
            onScroll={this.onScroll}
          >
            <div className="song-list-wrapper">
              {
                <SongList songs={this.props.songs} rank={this.props.rank} select={this.selectSong}></SongList>
              }
            </div>
            {!this.props.songs.length ? <Loading></Loading> : null}
          </Scroll>
        </div>
      </div>
    )
  }
}

MusicList = connect(null, {selectPlay})(withRouter(MusicList))

export default MusicList