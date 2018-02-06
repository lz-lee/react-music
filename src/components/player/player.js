import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import animations from 'create-keyframe-animation'
import { CSSTransition } from 'react-transition-group'

import Scroll from 'base/scroll/scroll'
import ProgressBar from 'base/progressBar/progressBar'
import {set_fullScreen, set_playing, set_currentIndex} from 'store/action-creator'
import {playMode} from 'common/js/config'
import {prefix} from 'common/js/prefix'

import './player.styl'

const transform = prefix('transform')
const transitionDuration = prefix('transitionDuration')
const timeExp = /\[(\d{2}):(\d{2}):(\d{2})]/g

class Player extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      songReady: false,
      currentTime: 0,
      radius: 32,
      playingLyric: '',
      currentLyric: null,
      currentLineNum: 0,
      currentShow: 'cd',
      isPureMusic: false,
      pureMusicLyric: ''
    }
    this.ready = this.ready.bind(this)
    this.error = this.error.bind(this)
    this.updateTime = this.updateTime.bind(this)
    this.end = this.end.bind(this)
    this.paused = this.paused.bind(this)
    this.togglePlaying = this.togglePlaying.bind(this)
    this.loop = this.loop.bind(this)
    this.prev = this.prev.bind(this)
    this.next = this.next.bind(this)
    this.format = this.format.bind(this)
    this.handlePercentChangeEnd = this.handlePercentChangeEnd.bind(this)
    this.handlePercentChanging = this.handlePercentChanging.bind(this)
  }

  static propTypes = {

  }

  static defaultProps = {

  }

  shouldComponentUpdate(nextProps, nextState) {
    this.watchCurrentSong(nextProps)
    this.watchPlaying(nextProps)
    return true
  }

  watchCurrentSong(nextProps) {
    const nextSong = nextProps.currentSong
    const oldSong = this.props.currentSong
    if (!nextSong.id || !nextSong.url ||nextSong.id === oldSong.id) {
      return false
    }
    this.setState({
      songReady: false
    })
    this.refs.audio.src = nextSong.url
    // 
    setTimeout(() => {
      this.refs.audio.play()
    }, 20)
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.setState({
        songReady: true
      })
    }, 5000)
  }
  
  watchPlaying(nextProps) {
    if (!this.state.songReady) {
      return false
    }
    const audio = this.refs.audio
    const newPlaying = nextProps.playing
    setTimeout(() => {
      newPlaying ? audio.play() : audio.pause()
    } ,20)
  }

  back() {
    this.props.set_fullScreen(false)
  }

  open() {
    this.props.set_fullScreen(true)
  }

  enter(el, isAppearing) {
    el.style.display = 'block'
    const {x, y, scale} = this.getPosAndScale()
    let animation = {
      0: {
        transform: `translate3d(${x}px, ${y}px, 0) scale(${scale})`
      },
      60: {
        transform: `translate3d(0,0,0) scale(1.1)`
      },
      100: {
        transform: `translate3d(0,0,0) scale(1)`
      }
    }
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 400,
        easing: 'linear'
      }
    })
    animations.runAnimation(this.refs.cdWrapper, 'move')
  }

  entered(el, isAppearing) {
    animations.unregisterAnimation('move')
    this.refs.cdWrapper.style.animation = ''
  }

  exit(el) {
    this.refs.cdWrapper.style.transition = 'all 0.4s'
    const {x, y, scale} = this.getPosAndScale()
    this.refs.cdWrapper.style[transform] = `translate3d(${x}px,${y}px,0) scale(${scale})`
  }

  exited(el) {
    this.refs.cdWrapper.style.transition = ''
    this.refs.cdWrapper.style[transform] = ''
    el.style.display = 'none'
  }

  getPosAndScale() {
    const targetWidth = 40
    const paddingLeft = 40
    const paddingBottom = 30
    const paddingTop = 80
    const width = window.innerWidth * 0.8
    const scale = targetWidth / width
    const x = -(window.innerWidth / 2 - paddingLeft)  // 动画x偏移
    const y = window.innerHeight - paddingTop - width / 2 - paddingBottom   // 动画y偏移
    return {
      x, y, scale
    }
  }
  loop() {
    this.refs.audio.currentTime = 0
    this.refs.audio.play()
    this.props.set_playing(true)
    if (this.state.currentLyric) {
      this.currentLyric.seek(0)
    }
  }

  prev() {
    if (!this.state.songReady) {
      return
    }
    if (this.props.playList.length === 1) {
      this.loop()
      return
    } else {
      let index = this.props.currentIndex - 1
      if (index === -1) {
        index = this.props.playList.length - 1
      }
      this.props.set_currentIndex(index)
      if (!this.props.playing) {
        this.togglePlaying()
      }
    }
  }

  next() {
    if (!this.state.songReady) {
      return
    }
    if (this.props.playList.length === 1) {
      this.loop()
      return
    } else {
      let index = this.props.currentIndex + 1
      if (index === this.props.playList.length) {
        index = 0
      }
      this.props.set_currentIndex(index)
      if (!this.props.playing) {
        this.togglePlaying()
      }
    }
  }

  ready() {
    this.setState({
      songReady: true
    })
  }

  error() {
    this.setState({
      songReady: true
    })
  }

  updateTime(e) {
    this.setState({
      currentTime: e.target.currentTime
    })

  }

  end() {
    this.setState({
      currentTime: 0
    })
    if (this.props.mode === playMode.loop) {
      this.loop()
    } else {
      this.next()
    }
  }

  paused() {

  }

  handlePercentChanging() {

  }

  handlePercentChangeEnd(percent) {
    console.log(this.props)
    const currentTime = this.props.currentSong.duration * percent
    this.setState({
      currentTime
    })
    this.refs.audio.currentTime = currentTime
    if (!this.props.playing) {
      this.togglePlaying()
    }
  }

  togglePlaying(e) {
    if (e) {
      e.stopPropagation()
    }
    if (!this.state.songReady) return
    this.props.set_playing(!this.props.playing)
  }

  format(interval) {
    interval = interval | 0 // 向下取整
    const minute = interval / 60 | 0
    const second = this._pad(interval % 60)
    return `${minute}:${second}`
  }

  _pad(num, n = 2) {
    let len = num.toString().length
    while (len < n) {
      num = '0' + num
      len++
    }
    return num
  }

  render() {
    const {playing, fullScreen, playList, sequenceList, mode, currentIndex, currentSong} = this.props
    const miniIcon = playing ? 'icon-pause-mini' : 'icon-play-mini'
    const playIcon = playing ? 'icon-pause' : 'icon-play'
    const cdCls = playing ? 'play' : 'play pause'
    const disableCls = this.state.songReady ? '' : 'disable'
    let percent = this.state.currentTime / currentSong.duration
    return (
      <div className="player">
        <CSSTransition
          in={fullScreen}
          timeout={300}
          classNames="normal"
          onEnter={(el) => this.enter(el)}
          onEntered={(el) => this.entered(el)}
          onExit={(el) => this.exit(el)}
          onExited={(el) => this.exited(el)}
        >
          <div className="normal-player">
            <div className="background">
              <img src={currentSong.image} alt="" width="100%" height="100%"/>
            </div>
            <div className="top">
              <div className="back" onClick={() => this.back()}>
                <i className="icon-back"></i>
              </div>
              <h1 className="title">{currentSong.name}</h1>
              <h2 className="subtitle">{currentSong.singer}</h2>
            </div>
            <div className="middle">
              <div className="middle-l">
                <div className="cd-wrapper" ref="cdWrapper">
                  <div className="cd">
                    <img className={"image " + cdCls} src={currentSong.image} alt=""/>
                  </div>
                </div>
                <div className="playing-lyric-wrapper">
                  <div className="playing-lyric">{this.state.playingLyric}</div>
                </div>
              </div>
              <Scroll
                className="lyric-wrapper"
                probeType={3}
                
              >
                <div className="lyric-wrapper">
                  {
                    this.state.currentLyric ? 
                    <div>
                      
                    </div> : null
                  }
                </div>
              </Scroll>
            </div>
            <div className="bottom">
              <div className="dot-wrapper">
                <span className="dot"></span>
                <span className="dot"></span>
              </div>
              <div className="progress-wrapper">
                <span className="time time-l">{this.format(this.state.currentTime)}</span>
                <div className="progress-bar-wrapper">
                  <ProgressBar percent={percent} percentChangeEnd={this.handlePercentChangeEnd} percentChanging={this.handlePercentChanging}></ProgressBar>
                </div>
                <span className="time time-r">{this.format(currentSong.duration)}</span>
              </div>
              <div className="operators">
                <div className="icon i-left">
                  <i className={mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'}></i>
                </div>
                <div className={`icon i-left ${disableCls}`}>
                  <i className="icon-prev" onClick={this.prev}></i>
                </div>
                <div className={`icon i-center ${disableCls}`} onClick={this.togglePlaying}>
                  <i className={playIcon}></i>
                </div>
                <div className={`icon i-right ${disableCls}`}>
                  <i className="icon-next" onClick={this.next}></i>
                </div>
                <div className="icon i-right">
                  <i className="icon icon-not-favorite"></i>
                </div>
              </div>
            </div>
          </div>
        </CSSTransition>
        {
          !fullScreen && currentIndex > -1 ? 
          <div className="mini-player" onClick={() => this.open()}>
            <div className="icon">
              <div className="imgWrapper">
                <img src={currentSong.image} width="40" height="40" alt="" className={cdCls}/>
              </div>
            </div>
            <div className="text">
              <h2 className="name">{currentSong.name}</h2>
              <p className="desc">{currentSong.singer}</p>
            </div>
            <div className="control">
              <i className={'icon-min ' + miniIcon} onClick={this.togglePlaying}></i>
            </div>
            <div className="control">
              <i className="icon-playlist"></i>
            </div>
          </div> : null
        }
        <audio ref="audio" onPlaying={this.ready} onError={this.error} onTimeUpdate={this.updateTime} onEnded={this.end} onPause={this.paused} src={currentSong.url}></audio>
      </div>
    )
  }
}

Player = connect(state => state.player, {
  set_fullScreen,
  set_playing,
  set_currentIndex
})(Player)

export default Player