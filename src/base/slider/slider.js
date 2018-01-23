import React, {Component} from 'react'
import PropTypes from 'prop-types'
import BScroll from 'better-scroll'
import './slider.styl'

export default class Slider extends Component{
  static propTypes = {
    loop: PropTypes.bool,
    autoPlay: PropTypes.bool,
    interval: PropTypes.number
  }

  static defaultProps = {
    loop: true,
    autoPlay: true,
    interval: 3000
  }

  constructor(props) {
    super(props)
    this.state = {
      dots: [],
      currentPageIndex: 0
    }
  }

  _setSliderWidth(isResize) {
    this.children = this.sliderGroup.children
    let width = 0
    let sliderWidth = this.sliderW.clientWidth
    for (let i = 0; i < this.children.length; i++) {
      let child = this.children[i]
      if (child.classList && !child.classList.contains('slider-item')) {
        child.classList.add('slider-item')
      }
      child.style.width = sliderWidth + 'px'
      width += sliderWidth
    }
    if (this.props.loop && !isResize) {
      width += 2 * sliderWidth
    }
    this.sliderGroup.style.width = width + 'px'
  }

  _initSlider() {
    this.slider = new BScroll(this.sliderW, {
      scrollX: true,
      scroolY: false,
      click: true,
      momentum: false,
      snap: {
        loop: this.state.loop,
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
    // 滑动轮播图时，暂停自动轮播
    this.slider.on('beforeScrollStart', () => {
      if (this.autoPlay) {
        clearTimeout(this.timer)
      }
    })
  }

  _initDots() {
    this.setState({
      dots: new Array(this.children.length)
    })
  }

  _play() {
    let pageIndex = this.state.currentPageIndex + 1
    if (this.props.loop) {
      pageIndex += 1
    }
    clearTimeout(this.timer)
    this.timer = setTimeout(() => {
      // goToPage(x, y, time), snap为true时，滚动到对应的页面
      this.slider.goToPage(pageIndex, 0, 400)
    }, this.interval)
  }

  _onScrollEnd() {
    console.log(this.slider)
    let pageIndex = this.slider.getCurrentPage().pageX
    if (this.state.loop) {
      pageIndex -= 1
    }
    this.setState({
      currentPageIndex: pageIndex
    })
    // 清除定时，防止手动操作时改变index与自动轮播相冲突
    if (this.props.autoPlay) {
      this._play()
    }
  }

  refresh() {
    if (this.slider) {
      this._setSliderWidth(true)
      this.slider.refresh()
    }
  }

  componentDidUpdate() {
    setTimeout(() => {
      // mounted 的时候，由于异步recommends数据，slot里的元素不一定会有，需要判断recommends.length
        this._setSliderWidth()
        this._initDots()
        this._initSlider()
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

  render() {
    const {dots} = this.state
    return (
      <div className="slider-wrapper" ref={sliderW => this.sliderW = sliderW}>
        <div className="slider-group" ref={sliderGroup => this.sliderGroup = sliderGroup}>
          {this.props.children}
        </div>
        <div className="dots">
          {
            dots.map((v, i) =>
              <span
                className={'dot' + this.state.currentPageIndex === i ? ' active' : ''}
                key={v}
                ></span>
            )
          }
        </div>
      </div>
    )
  }
}