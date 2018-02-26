import React from 'react'
import {connect} from 'react-redux'

import {CSSTransition, TransitionGroup} from 'react-transition-group'

import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'

import {playMode} from 'common/js/config'

import './playList.styl'

class PlayList extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      showFlag: false
    }
  }

  show() {
    this.setState({
      showFlag: true
    })
  }

  render() {
    const {player: {mode}} = this.props
    const modeText = mode === playMode.sequence ? '顺序播放' :  mode === playMode.random ? '随机播放' : '单曲循环'
    const modeIcon = mode === playMode.sequence ? 'icon-sequence' : mode === playMode.loop ? 'icon-loop' : 'icon-random'
    return (
      <CSSTransition
        in={this.state.showFlag}
        timeout={200}
        classNames="list-fade">
        <div className="playlist">
          <div className="list-wrapper">
            <div className="list-header">
              <h1 className="title">
                <i className={"icon " + modeIcon}></i>
                <span className="text">{modeText}</span>
                <span className="clear"><i className="icon-clear"></i></span>
              </h1>
            </div>
            <Scroll
              ref="listContent"
              className="list-content"
              probeType={3}
            >
              <TransitionGroup>
                {
                  this.props.player.sequenceList.map((v, i) => 
                    <CSSTransition 
                      key={v.id}
                      timeout={200}
                      classNames="list"
                      >
                      <li className="item">
                        <i className="current"></i>
                        <span className="text"></span>
                        <span className="like">
                          <i></i>
                        </span>
                        <span className="delete">
                          <i className="icon-delete"></i>
                        </span>
                      </li>
                    </CSSTransition>
                  )
                }
              </TransitionGroup>
            </Scroll>
            <div className="list-operate">
              <div className="add">
                <i className="icon-add"></i>
                <span className="text">添加歌曲到队列</span>
              </div>
            </div>
            <div className="list-close">
              <span>关闭</span>
            </div>
          </div>
          <Confirm
            ref="confirm"
            text="是否清空所有搜索历史"
            confirmBtnText="清空"
          ></Confirm>
        </div>
      </CSSTransition>
    )
  }
}

PlayList = connect(state => state)(PlayList)
export default PlayList