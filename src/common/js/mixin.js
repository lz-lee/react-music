import React from 'react'
import {connect} from 'react-redux'

import {
  set_playing,
  set_currentIndex,
  set_playMode,
  set_playList
} from 'store/action-creator'

import {playMode} from 'common/js/config'
import {shuffle} from 'common/js/util'

export const playListHoc = (WrapperComponent) => {
  class PlayHoc extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
      this.changeMode = this.changeMode.bind(this)
      this.show = this.show.bind(this)
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

    show() {
      const instance = this.refs.wrapperComponent.getWrappedInstance()
      instance && instance.show()
    }

    render() {
      const {mode} = this.props
      const modeIcon = mode === playMode.sequence ? 'icon-sequence' : mode === playMode.loop ? 'icon-loop' : 'icon-random'
      let props ={
        ...this.props,
        modeIcon
      }
      return (
        <WrapperComponent {...props} changeMode={this.changeMode} ref="wrapperComponent"/>
      )
    }
  }
  return connect(state => state.player, {
    set_playing,
    set_currentIndex,
    set_playMode,
    set_playList
  }, null, {withRef: true})(PlayHoc)
}