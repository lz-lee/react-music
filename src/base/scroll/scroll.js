import React, {Component} from 'react'
import BScroll from 'better-scroll'
import PropTypes from 'prop-types'
import './scroll.styl'

export default class Scroll extends Component{
  static propTypes = {
    probeType: PropTypes.number,
    click: PropTypes.bool,
    refresh: PropTypes.bool,
    pullUp: PropTypes.bool,
    onScroll: PropTypes.func
  }

  static defaultProps = {
    probeType: 1,
    click: true,
    refresh: false,
    pullUp: false,
    onScroll: null
  }

  refresh() {
    if (this.scroll) {
      this.scroll.refresh()
    }
  }

  componentDidMount() {
    if (!this.scroll) {
      this.scroll = new BScroll(this.scrollWrapper, {
        click: this.props.click,
        probeType: this.props.probeType
      })
      // 暴露scroll事件的回调函数
      if (this.props.onScroll) {
        this.scroll.on('scroll', (scroll) => {
          this.props.onScroll(scroll)
        })
      }
    }
  }
  componentWillUpdate (nextProps, nextState) {
    if (this.scroll && this.props.refresh) {
      this.scroll.refresh()
    }
  }

  componentWillUnmount() {
    this.scroll.off('scroll')
    this.scroll = null
  }
  
  render() {
    return (
      <div
        className="scroll-wrapper"
        ref={(scrollWrapper => this.scrollWrapper = scrollWrapper)}>
        {this.props.children}
      </div>
    )
  }
}