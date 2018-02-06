import React from 'react'
import Proptypes from 'prop-types'
import {prefix} from 'common/js/prefix'

import './progressBar.styl'

const progressBtnWidth = 16
const transform = prefix('transform')

export default class ProgressBar extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
    this.touch = {}
    this.progressClick = this.progressClick.bind(this)
    this.touchStart = this.touchStart.bind(this)
    this.touchMove = this.touchMove.bind(this)
    this.touchEnd = this.touchEnd.bind(this)
  }
  static propTypes = {
    percent: Proptypes.number,
    percentChanging: Proptypes.func,
    percentChange: Proptypes.func
  }

  static defaultProps = {
    percent: 0,
    percentChanging: null,
    percentChange: null
  }

  componentWillReceiveProps(nextProps) {
    this.setProgressOffset(nextProps.percent)
  }
  
  progressClick(e) {
    const rect = this.refs.progressBar.getBoundingClientRect()
    const offsetWidth = e.pageX - rect.left
    this._offset(offsetWidth)
    this.triggerPercent()
  }

  touchStart(e) {
    this.touch.init = true
    this.touch.startX = e.touches[0].pageX
    this.touch.left = this.refs.progress.clientWidth
  }
  
  touchMove(e) {
    if (!this.touch.init) return
    const deltaX = e.touches[0].pageX - this.touch.startX
    // Math.min 最大不能大于，Math.max 最小为0
    const offsetWidth = Math.min(this.refs.progressBar.clientWidth - progressBtnWidth, Math.max(0, this.touch.left + deltaX))
    this._offset(offsetWidth)
    this.props.percentChanging && this.props.percentChanging(this.getPercent())
  }

  touchEnd() {
    this.touch.init = false
    // 将拖动完后的 percent 传递给父组件，修改播放进度
    this.triggerPercent()
  }

  triggerPercent() {
    this.props.percentChangeEnd && this.props.percentChangeEnd(this.getPercent())
  }

  getPercent() {
    const barWidth = this.refs.progressBar.clientWidth - progressBtnWidth
    return this.refs.progress.clientWidth / barWidth
  }

  setProgressOffset(percent) {
    if (percent > 0 && !this.touch.init) {
      const barWidth = this.refs.progressBar.clientWidth - progressBtnWidth
      const offsetWidth = barWidth * percent
      this._offset(offsetWidth)
    }
  }

  _offset(offsetWidth) {
    this.refs.progress.style.width = `${offsetWidth}px`
    this.refs.progressBtn.style[transform] = `translate3d(${offsetWidth}px,0,0)`
  }

  render() {
    return (
      <div className="progress-bar" ref="progressBar" onClick={this.progressClick}>
        <div className="bar-inner">
          <div className="progress" ref="progress"></div>
          <div className="progress-btn-wrapper" ref="progressBtn"
            onTouchStart={this.touchStart}
            onTouchMove={this.touchMove}
            onTouchEnd={this.touchEnd}>
            <div className="progress-btn"></div>
          </div>
        </div>
      </div>
    )
  }
}