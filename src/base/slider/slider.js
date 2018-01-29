import React from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'

import './slider.styl'

export default class Slider extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dots: [],
      currentPageIndex: 0
    }
    this.refresh  = this.refresh.bind(this)
    this._initSlider  = this._initSlider.bind(this)
    this._initDots  = this._initDots.bind(this)
    this._setSliderWidth  = this._setSliderWidth.bind(this)
    this._onScrollEnd = this._onScrollEnd.bind(this)
    this._play = this._play.bind(this)
  }

  static propTypes = {
    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    refresh: PropTypes.bool,
    interval: PropTypes.number
  }

  static defaultProps = {
    loop: true,
    autoPlay: true,
    refresh: false,
    interval: 4000
  }

  componentDidMount() {
    setTimeout(() => {
      this._setSliderWidth()
      this._initDots()
      this._initSlider()
      console.log(this.state)
      console.log(this.props)
      if (this.props.autoPlay) {
        this._play()
      }
    }, 20)

    window.addEventListener('resize', () => {
      if (!this.slider || !this.slider.enabled) {
        return
      }
      clearTimeout(this.resizeTimer)
      this.resizeTimer = setTimeout(() => {
        if (this.slider.isInTransition) {
          this._onScrollEnd()
        } else {
          if (this.props.autoPlay) {
            this._play()
          }
        }
        this.refresh()
      }, 60)
    })
  }
  
  componentWillUnmount() {
    this.slider.disable()
    clearTimeout(this.timer)
  }

  refresh() {
    if (this.slider && this.props.refresh) {
      this._setSliderWidth(true)
      this.slider.refresh()
    }
  }

  _setSliderWidth(isResize) {
    if (this.props.children.length) {
      this.children = this.refs.sliderGroup.children
      let width = 0
      let sliderWidth = this.refs.slider.clientWidth
      for (let i = 0; i < this.children.length; i++) {
        let child = this.children[i]
        !child.classList.contains('slider-item') && child.classList.add('slider-item')
        child.style.width = sliderWidth + 'px'
        width += sliderWidth
      }
      if (this.props.loop && !isResize) {
        width += 2 * sliderWidth
      }
      this.refs.sliderGroup.style.width = width + 'px'
    }
  }

  _initSlider() {
    this.slider = new BScroll(this.refs.slider, {
      scrollX: true,
      scrollY: false,
      momentum: false,
      snap: {
        loop: this.props.loop,
        threshold: 0.3,
        speed: 400
      }
    })

    this.slider.on('scrollEnd', this._onScrollEnd)

    this.slider.on('touchend', () => {
      if (this.props.autoPlay) {
        this._play()
      }
    })

    this.slider.on('beforeScrollStart', () => {
      if (this.props.autoPlay) {
        clearTimeout(this.timer)
      }
    })
  }

  _onScrollEnd() {
    let pageIndex = this.slider.getCurrentPage().pageX
    this.setState({
      currentPageIndex: pageIndex
    })
    if (this.props.autoPlay) {
      this._play()
    }
  }

  _initDots() {
    this.setState({
      dots: new Array(this.props.children.length)
    })
  }

  _play() {
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      this.slider.next()
    }, this.props.interval)
  }

  render() {
    return (
      <div className="slider" ref="slider">
        <div className="slider-group" ref="sliderGroup">
          {this.props.children}
        </div>
        <div className="dots">
          {
            this.state.dots.map((v, i) => 
              <span
                className="dot"
                key={i}
              ></span>
            )
          }
        </div>
      </div>
    )
  }
}