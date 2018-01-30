import React from 'react'
import PropTypes from 'prop-types'

import LazyLoad, {forceCheck} from 'react-lazyload'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import './listview.styl'

const TITLE_HEIGHT = 30
const ANCHOR_HEIGHT = 18

export default class ListView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      diff: -1,
      currentIndex: 0,
      scrollY: -1,
      shortcutList: []
    }
    this.touch = {}
    this.listHeight = []
    this.onShortcutTouchMove = this.onShortcutTouchMove.bind(this)
    this.onShortcutTouchStart = this.onShortcutTouchStart.bind(this)
    this.onTouchEnd = this.onTouchEnd.bind(this)
    this._calculateHeight = this._calculateHeight.bind(this)
  }

  static propTypes = {
    data: PropTypes.array,
    refresh: PropTypes.bool
  }

  static defaulProps = {
    data: [],
    refresh: false
  }

  componentDidMount() {

  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      shortcutList: nextProps.data.map(v => v.title.substr(0, 1))
    }, () => {
      this._calculateHeight()
    })
  }

  onShortcutTouchStart(e) {
    e.stopPropagation()
    // e.preventDefault() 设置passive:true，表示不调用 preventDefault函数来阻止事件默认行为，那么浏览器就能快速生成事件，提升页面性能
    // https://segmentfault.com/a/1190000007913386
    let index = e.target.dataset.index
    let firstTouch = e.touches[0]
    this.touch.y1 = firstTouch.pageY
    this.touch.index = index
  }

  onShortcutTouchMove(e) {
    e.stopPropagation()
    let firstTouch = e.touches[0]
    this.touch.y2 = firstTouch.pageY
    let delta = (this.touch.y2 - this.touch.y1) / ANCHOR_HEIGHT | 0
    let index = parseInt(this.touch.index, 10) + delta
    this._scrollTo(index)
  }

  onTouchEnd(e) {
    e.stopPropagation()

  }
  handlerScroll(pos) {
    this.setState({
      scrollY: pos.y
    })
    forceCheck()
  }

  _calculateHeight() {
    const list = [...this.refs.listGroup.children]
    let height = 0
    this.listHeight.push(height)
    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      height += item.clientHeight
      this.listHeight.push(height)
    }
  }

  _scrollTo(index) {
    if (!index && index !== 0) {
      return
    }
    if (index < 0) {
      index = 0
    } else if (index > this.listHeight.length - 2) {
      index = this.listHeight.length - 2
    }
    console.log(this.listHeight)
    console.log(index)
    this.refs.listview.scrollToElement([...this.refs.listGroup.children][index], 0)
    this.setState({
      scrollY: this.refs.listview.scroll.y
    })

  }

  render() {

    return (
      <div className="list-view">
        <Scroll
          className="listview"
          ref="listview"
          probeType={3}
          refresh={this.props.refresh}
          onScroll={this.handlerScroll}
        >
          <ul ref="listGroup">
            {
              this.props.data.map((v,i) =>
                <li
                  className="list-group"
                  key={v.title}
                >
                  <h2 className="list-group-title">{v.title}</h2>
                  <ul>
                    {
                      v.items.map((k) =>
                        <li
                          className="list-group-item"
                          key={k.id}
                          >
                          <LazyLoad>
                            <img src={k.avatar} alt="" className="avatar"/>
                          </LazyLoad>
                          <span className="name">{k.name}</span>
                        </li>
                      )
                    }
                  </ul>
                </li>
              )
            }
          </ul>
          <div
            className="list-shortcut"
            onTouchStart={this.onShortcutTouchStart}
            onTouchMove={this.onShortcutTouchMove}
            onTouchEnd={this.onTouchEnd}
            >
            <ul>
              {
                this.state.shortcutList.map((v, i) =>
                  <li
                    key={v}
                    className={'item' + (this.state.currentIndex === i ? ' current' : '')}
                    data-index={i}>
                    {v}
                  </li>
                )
              }
            </ul>
          </div>
          {!this.props.data.length ? <Loading></Loading> : null}
        </Scroll>
      </div>
    )
  }
}