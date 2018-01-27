import React, {Component} from 'react'
import BScroll from 'better-scroll'
import PropTypes from 'prop-types'
import './scroll.styl'

export default class Scroll extends Component{
  constructor(props) {
    super(props)
    this.refresh = this.refresh.bind(this)
    this.initScroll = this.initScroll.bind(this)

  }
  static propTypes = {
    probeType: PropTypes.number,
    click: PropTypes.bool,
    refresh: PropTypes.bool,
    beforeScroll: PropTypes.bool,
    pullUp: PropTypes.bool,
    onScroll: PropTypes.func,
    scrollToEnd: PropTypes.func,
    onBeforeScroll: PropTypes.func,
  }

  static defaultProps = {
    probeType: 1,
    click: true,
    refresh: false,
    beforeScroll: false,
    pullUp: false,
    onScroll: null,
    scrollToEnd: null,
    onBeforeScroll: null,
  }
  componentDidMount() {
    setTimeout(() => {
      this.initScroll()
    }, 20)
  }

  componentDidUpdate (nextProps, nextState) {
    if (this.scroll && this.props.refresh) {
      this.scroll.refresh()
    }
  }

  componentWillUnmount() {
    this.scroll.off('scroll')
    this.scroll = null
  }
  refresh() {
    this.scroll && this.scroll.refresh()
  }

  disable() {
    this.scroll && this.scroll.disable()
  }

  enable() {
    this.scroll && this.scroll.enable()
  }

  scrollTo() {
    this.scroll && this.scroll.scrollTo.apply(this.scroll, arguments)
  }

  scrollToElement() {
    this.scroll && this.scroll.scrollToElement.apply(this.scroll, arguments)
  }

  initScroll() {
    if (!this.refs.scrollWrapper) {
      return
    }
    this.scroll = new BScroll(this.refs.scrollWrapper, {
      click: this.props.click,
      probeType: this.props.probeType
    })

    if (this.props.onScroll) {
      this.scroll.on('scroll', (scroll) => {
        this.props.onScroll(scroll)
      })
    }
    
    if (this.props.pullup) {
      this.scroll.on('scrollEnd', () => {
        if (this.scroll.y <= (this.scroll.maxScrollY + 50)) {
          this.props.scrollToEnd()
        }
      })
    }

    if (this.props.beforeScroll) {
      this.scroll.on('beforeScrollStart', () => {
        this.props.onBeforeScroll()
      })
    }
  }

  render() {
    return (
      <div
        className="scroll-wrapper"
        ref="scrollWrapper">
        {this.props.children}
      </div>
    )
  }
}