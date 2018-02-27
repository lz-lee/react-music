import React from 'react'
import {connect} from 'react-redux'

import {TransitionGroup, CSSTransition} from 'react-transition-group'

import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'
import AddSong from 'components/addSong/addSong'

import {playMode} from 'common/js/config'
import {playListHoc} from 'common/js/mixin'

import {deleteSong, deleteSonglist} from 'store/action'

import './playList.styl'

class PlayList extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      showFlag: false,
      showAddSong: false,
      refreshDelay: 120
    }
    this.show = this.show.bind(this)
    this.hide = this.hide.bind(this)
    this.scrollToCurrent = this.scrollToCurrent.bind(this)
    this.showConfirm = this.showConfirm.bind(this)
    this.confirmClear = this.confirmClear.bind(this)
    this.addSong = this.addSong.bind(this)
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.playList.length) {
      this.hide()
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    const newSong = nextProps.currentSong
    const sequenceList = nextProps.sequenceList

    // if (!nextState.showFlag || newSong.id === oldSong.id) {
    //   return false
    // }
    this.scrollToCurrent(newSong, sequenceList)
    return true
  }

  show() {
    this.setState({
      showFlag: true
    }, () => {
      this.refs.listContent.refresh()
      this.scrollToCurrent(this.props.currentSong, this.props.sequenceList)
    })
  }

  hide() {
    this.setState({
      showFlag: false
    })
  }

  exit(el) {
    // hack 由于render的style直接改变为none，导致动画无效
    el.style.display = 'block'
  }

  exited(el) {
    el.style.display = 'none'
  }

  scrollToCurrent(current, sequenceList) {
    const index = sequenceList.findIndex(v => {
      return current.id === v.id
    })
    this.refs.listContent.scrollToElement([...this.refs.listGroup.children[0].children][index], 300)
  }

  selectItem(v, i) {
    if (this.props.mode === playMode.random) {
      i = this.props.playList.findIndex(song => {
        return song.id === v.id
      })
    }
    this.props.set_currentIndex(i)
    this.props.set_playing(true)
  }

  deleteOne(v, e) {
    e.stopPropagation()
    if (v.deleting) {
      return
    }
    v.deleting = true
    this.props.deleteSong(v)
    setTimeout(() => {
      v.deleting = false
    }, 200)
  }

  showConfirm() {
    this.refs.confirm.show()
  }

  confirmClear() {
    this.props.deleteSonglist()
    this.hide()
  }

  addSong() {
    this.setState({
      showAddSong: true
    })
  }

  hideAddSong() {
    this.setState({
      showAddSong: false
    })
  }

  render() {
    const {mode, currentSong, sequenceList, modeIcon} = this.props
    const modeText = mode === playMode.sequence ? '顺序播放' :  mode === playMode.random ? '随机播放' : '单曲循环'
    return (
      <CSSTransition
        in={this.state.showFlag}
        timeout={200}
        classNames="list-fade"
        onExit={(el) => this.exit(el)}
        onExited={(el) => this.exited(el)}>
        <div
          style={{'display': this.state.showFlag ? 'block' : 'none'}}
          className="playlist"
          onClick={this.hide}>
          <div
            className="list-wrapper"
            onClick={(e) => e.stopPropagation()}>
            <div className="list-header">
              <h1 className="title">
                <i className={"icon " + modeIcon} onClick={this.props.changeMode}></i>
                <span className="text">{modeText}</span>
                <span className="clear" onClick={this.showConfirm}><i className="icon-clear"></i></span>
              </h1>
            </div>
            <Scroll
              ref="listContent"
              className="list-content"
              probeType={3}
              data={sequenceList}
              refreshDelay={this.state.refreshDelay}
            >
              <div ref="listGroup">
                <TransitionGroup>
                  {
                    sequenceList.map((v, i) =>
                      <CSSTransition
                        key={v.id}
                        timeout={200}
                        classNames="list"
                        >
                        <li className="item" onClick={() => this.selectItem(v, i)}>
                          <i className={"current " + (currentSong.id === v.id ? 'icon-play' : '')}></i>
                          <span className="text">{v.name}</span>
                          <span className="like">
                            <i className="icon-not-favorite"></i>
                          </span>
                          <span className="delete" onClick={(e) => this.deleteOne(v, e)}>
                            <i className="icon-delete"></i>
                          </span>
                        </li>
                      </CSSTransition>
                    )
                  }
                </TransitionGroup>
              </div>
            </Scroll>
            <div className="list-operate">
              <div className="add" onClick={this.addSong}>
                <i className="icon-add"></i>
                <span className="text">添加歌曲到队列</span>
              </div>
            </div>
            <div className="list-close" onClick={this.hide}>
              <span>关闭</span>
            </div>
          </div>
          <Confirm
            ref="confirm"
            text="是否清空播放列表"
            confirmBtnText="清空"
            confirm={this.confirmClear}
          ></Confirm>
          <AddSong
            showFlag={this.state.showAddSong}
            hide={() => this.hideAddSong()}></AddSong>
        </div>
      </CSSTransition>
    )
  }
}

PlayList = playListHoc(connect(null, {deleteSong, deleteSonglist}, null, {withRef: true})(PlayList))
export default PlayList