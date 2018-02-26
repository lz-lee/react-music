import React from 'react'
import {connect} from 'react-redux'

import {Transition, TransitionGroup, CSSTransition} from 'react-transition-group'

import Scroll from 'base/scroll/scroll'
import Confirm from 'base/confirm/confirm'

import {playMode} from 'common/js/config'

import './playList.styl'

const defaultStyle = {
  transition: 'all 0.3s',
  opacity: 0,
}

const transitionStyle = {
  entering: { opacity: 0 },
  entered: { opacity: 1 }
}

const wrapperStyle = {
  transition: 'all 0.3s',
  transform: 'translate3d(0, 100%, 0)'
}

const wrapperTransitionStyle = {
  entering: { transform: 'translate3d(0, 100%, 0)' },
  entered: { transform: 'translate3d(0, 0, 0)' }
}

class PlayList extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      showFlag: false
    }
    this.show = this.show.bind(this)
    this.getWrappedInstance = this.getWrappedInstance.bind(this)
  }

  show() {
    this.setState({
      showFlag: true
    })
  }

  getWrappedInstance() {
    if (this.props.withRef) {
      return this.wrappedInstance
    }
  }

  render() {
    const {player: {mode}} = this.props
    const modeText = mode === playMode.sequence ? '顺序播放' :  mode === playMode.random ? '随机播放' : '单曲循环'
    const modeIcon = mode === playMode.sequence ? 'icon-sequence' : mode === playMode.loop ? 'icon-loop' : 'icon-random'
    return (
      <Transition
        in={this.state.showFlag}
        timeout={200}
        classNames="list-fade">
        {
          (state) => (
            <div className="playlist" style={{
              ...defaultStyle,
              ...transitionStyle[state]
            }}>
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
          )
        }
      </Transition>
    )
  }
}

PlayList = connect(state => state, null, null, {withRef: true})(PlayList)
export default PlayList