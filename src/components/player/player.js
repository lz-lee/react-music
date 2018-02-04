import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import animations from 'create-keyframe-animation'
import { CSSTransition } from 'react-transition-group'

import Scroll from 'base/scroll/scroll'
import {setFullScreen} from 'store/action'
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
    
  }

  static propTypes = {

  }

  static defaultProps = {

  }

  back() {
    this.props.setFullScreen(false)
  }

  open() {
    this.props.setFullScreen(true)
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

  ready() {

  }

  error() {

  }

  updateTime() {

  }

  end() {

  }

  paused() {

  }
  render() {
    console.log(this.props)
    const {player: {playing, fullScreen, playList, sequenceList, mode, currentIndex, currentSong}} = this.props
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
                    <img className="image" src={currentSong.image} alt=""/>
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
                <span className="time time-l"></span>
                <div className="progress-bar-wrapper">

                </div>
              </div>
              <div className="operators">
                <div className="icon i-left">
                  <i className={mode === playMode.sequence ? 'icon-sequence' : this.mode === playMode.loop ? 'icon-loop' : 'icon-random'}></i>
                </div>
                <div className="icon i-left">
                  <i className="icon-prev"></i>
                </div>
                <div className="icon i-center">
                  <i className={playing ? 'icon-pause' : 'icon-play'}></i>
                </div>
                <div className="icon i-right">
                  <i className="icon-next"></i>
                </div>
                <div className="icon i-right">
                  <i className="icon"></i>
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
                <img src={currentSong.image} width="40" height="40" alt=""/>
              </div>
            </div>
            <div className="text">
              <h2 className="name">{currentSong.name}</h2>
              <p className="desc">{currentSong.singer}</p>
            </div>
            <div className="control">
              
            </div>
            <div className="control">
              <i className="icon-playlist"></i>
            </div>
          </div> : null
        }
        <audio ref="audio" onPlay={this.ready} onError={this.error} onTimeUpdate={this.updateTime} onEnded={this.end} onPause={this.paused}></audio>
      </div>
    )
  }
}

Player = connect(state => state, {
  setFullScreen
})(Player)

export default Player