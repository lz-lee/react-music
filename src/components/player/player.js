import React from 'react'
import {connect} from 'react-redux'
import PropTypes from 'prop-types'

import animations from 'create-keyframe-animation'
import { CSSTransition } from 'react-transition-group'
import Lyric from 'lyric-parser'

import Scroll from 'base/scroll/scroll'
import ProgressBar from 'base/progressBar/progressBar'
import ProgressCircle from 'base/progressCircle/progressCircle'
import PlayList from 'components/playList/playList'

import {
  set_fullScreen,
  set_playing,
  set_currentIndex,
  set_playMode,
  set_playList
} from 'store/action-creator'

import {playMode} from 'common/js/config'
import {prefix} from 'common/js/prefix'
import {shuffle} from 'common/js/util'

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
    this.touch = {}
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
    this.changeMode = this.changeMode.bind(this)
    this.handleLyric = this.handleLyric.bind(this)
    this.touchStart = this.touchStart.bind(this)
    this.touchMove = this.touchMove.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
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
    if (!nextSong.id || !nextSong.url || nextSong.id === oldSong.id) {
      return false
    }
    this.setState({
      songReady: false
    })
    this.canLyricPlay = false
    // 切换歌曲，重置歌词数据
    if (this.state.currentLyric) {
      this.state.currentLyric.stop()
      this.setState({
        currentLyric: null,
        playingLyric: '',
        currentLineNum: 0
      })
    }
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
    this.getLyric(nextSong)
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

  getLyric(nextSong) {
    nextSong.getLyric().then((lyric) => {
      if (nextSong.lyric !== lyric) {
        return
      }
      const currentLyric = new Lyric(lyric, this.handleLyric)
      this.setState({
        currentLyric,
        isPureMusic: !currentLyric.lines.length
      }, () => {
        if (this.state.isPureMusic) {
          const pureMusicLyric = this.state.currentLyric.lrc.replace(timeExp, '').trim()
          this.setState({
            pureMusicLyric,
            playingLyric: pureMusicLyric
          })
        } else {
          if (this.props.playing && this.canLyricPlay) {
            this.state.currentLyric.seek(this.state.currentTime * 1000)
          }
        }
      })
    }).catch(() => {
      this.setState({
        currentLyric: null,
        playingLyric: '',
        currentLineNum: 0
      })
    })
  }

  handleLyric({lineNum, txt}) {
    // 根据子元素的长度判断，注意绑定this
    if (!this.refs.lyricLines.children.length) {
      return
    }
    if (lineNum > 5) {
      let lineEl = this.refs.lyricLines.children[lineNum - 5]
      this.refs.lyricList.scrollToElement(lineEl, 1000)
    } else {
      this.refs.lyricList.scrollTo(0, 0, 1000)
    }
    this.setState({
      currentLineNum: lineNum,
      playingLyric: txt
    })
  }

  touchStart(e) {
    const touch = e.touches[0]
    this.touch.init = true
    // 是否为一次移动
    this.touch.moved = false
    this.touch.startX = touch.pageX
    this.touch.startY = touch.pageY
  }

  touchMove(e) {
    if (!this.touch.init) return
    const touch = e.touches[0]
    const deltaX = touch.pageX - this.touch.startX
    const deltaY = touch.pageY - this.touch.startY
    // 表示向下滑动
    if (Math.abs(deltaY) > Math.abs(deltaX)) return
    if (!this.touch.moved) {
      this.touch.moved = true
    }
    // A为常量，Math.min(A, X) ==> X 小于等于(不大于) A, A为最大值
    // Math.max(A, X) ==> X 大于等于(不小于) A, A为最小值
    const left = this.state.currentShow === 'cd' ? 0 : -window.innerWidth
    // -window.innderWidth <= offsetWidth <= 0
    const offsetWidth = Math.min(0, Math.max(-window.innerWidth, left + deltaX))
    this.touch.percent = Math.abs(offsetWidth / window.innerWidth)
    this.refs.lyricList.refs.scrollWrapper.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    this.refs.lyricList.refs.scrollWrapper.style[transitionDuration] = 0
    this.refs.middleL.style.opacity = 1 - this.touch.percent
    this.refs.middleL.style[transitionDuration] = 0
  }

  touchEnd() {
    if (!this.touch.moved) return
    let offsetWidth
    let opacity
    if (this.state.currentShow === 'cd') {
      // 从右往左滑大于10%
      if (this.touch.percent > 0.1) {
        offsetWidth = -window.innerWidth
        opacity = 0
        this.setState({
          currentShow: 'lyric'
        })
      } else {
        offsetWidth = 0
        opacity = 1
      }
    } else {
      // 从左到右滑大于10%
      if (this.touch.percent < 0.9) {
        offsetWidth = 0
        opacity = 1
        this.setState({
          currentShow: 'cd'
        })
      } else {
        offsetWidth = -window.innerWidth
        opacity = 0
      }
    }
    const time = 300
    this.refs.lyricList.refs.scrollWrapper.style[transform] = `translate3d(${offsetWidth}px, 0, 0)`
    this.refs.lyricList.refs.scrollWrapper.style[transitionDuration] = `${time}ms`
    this.refs.middleL.style.opacity = opacity
    this.refs.middleL.style[transitionDuration] = `${time}ms`
    this.touch.init = false
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
      this.state.currentLyric.seek(0)
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
    this.canLyricPlay = true
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
    this.props.set_playing(false)
    if (this.state.currentLyric) {
      this.state.currentLyric.stop()
    }
  }

  handlePercentChanging(percent) {
    const currentTime = this.props.currentSong.duration * percent
    this.setState({
      currentTime
    })
    if (this.state.currentLyric) {
      this.state.currentLyric.seek(currentTime * 1000)
    }
  }

  handlePercentChangeEnd(percent) {
    const currentTime = this.props.currentSong.duration * percent
    this.setState({
      currentTime
    })
    this.refs.audio.currentTime = currentTime
    if (this.state.currentLyric) {
      this.state.currentLyric.seek(currentTime * 1000)
    }
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
    if (this.state.currentLyric) {
      this.state.currentLyric.togglePlay()
    }
  }

  showPlaylist(e) {
    e.stopPropagation()
    this.refs.playList.show()
  }

  changeMode() {
    const mode = (this.props.mode + 1) % 3
    this.props.set_playMode(mode)
    let list = null
    if (mode === playMode.random) {
      list = shuffle(this.props.sequenceList)
    } else {
      list = this.props.sequenceList
    }
    // set list 需要在前，需要根据下一个list来设置currentSong
    this.props.set_playList(list)
    this.resetCurrentIndex(list)
  }

  resetCurrentIndex(list) {
    let index = list.findIndex(v => {
      return v.id === this.props.currentSong.id
    })
    this.props.set_currentIndex(index)
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
    const modeIcon = mode === playMode.sequence ? 'icon-sequence' : mode === playMode.loop ? 'icon-loop' : 'icon-random'
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
            <div
              className="middle"
              onTouchStart={this.touchStart}
              onTouchMove={this.touchMove}
              onTouchEnd={this.touchEnd}
              >
              <div className="middle-l" ref="middleL">
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
                className="middle-r"
                probeType={3}
                ref="lyricList"
                data={this.state.currentLyric && this.state.currentLyric.lines}
              >
                <div className="lyric-wrapper">
                  {
                    this.state.currentLyric ?
                    <div ref="lyricLines">
                      {
                        this.state.currentLyric.lines.map((v, i) =>
                          <p
                            key={v.time}
                            className={'text ' + (this.state.currentLineNum === i ? 'current' : '')}
                          >
                            {v.txt}
                          </p>
                        )
                      }
                    </div> : null
                  }
                  {
                    this.state.isPureMusic ?
                    <div className="pure-music">
                      <p>{this.state.pureMusicLyric}</p>
                    </div> : null
                  }
                </div>
              </Scroll>
            </div>
            <div className="bottom">
              <div className="dot-wrapper">
                <span className={'dot ' + (this.state.currentShow === 'cd' ? 'active' : '')}></span>
                <span className={'dot ' + (this.state.currentShow === 'lyric' ? 'active' : '')}></span>
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
                  <i className={modeIcon} onClick={this.changeMode}></i>
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
              <ProgressCircle radius={this.state.radius} percent={percent}>
                <i className={'icon-mini ' + miniIcon} onClick={this.togglePlaying}></i>
              </ProgressCircle>
            </div>
            <div className="control" onClick={this.showPlaylist}>
              <i className="icon-playlist"></i>
            </div>
          </div> : null
        }
        <PlayList ref="playList"></PlayList>
        <audio ref="audio" onPlaying={this.ready} onError={this.error} onTimeUpdate={this.updateTime} onEnded={this.end} onPause={this.paused} src={currentSong.url}></audio>
      </div>
    )
  }
}

Player = connect(state => state.player, {
  set_fullScreen,
  set_playing,
  set_currentIndex,
  set_playMode,
  set_playList
})(Player)

export default Player