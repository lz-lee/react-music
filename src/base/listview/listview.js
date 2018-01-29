import React from 'react'
import PropTypes from 'prop-types'

import LazyLoad, {forceCheck} from 'react-lazyload'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import './listview.styl'

export default class ListView extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      diff: -1,
      currentIndex: 0,
      scrollY: -1,
      shortcutList: []
    }
  }

  static propTypes = {
    data: PropTypes.array
  }

  static defaulProps = {
    data: []
  }
  
  componentDidMount() {
    
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      shortcutList: nextProps.data.map(v => v.title.substr(0, 1))
    })
  }
  
  onShortcutTouchStart(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  onShortcutTouchMove(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  onTouchEnd(e) {
    e.stopPropagation()
    e.preventDefault()
  }

  render() {
    
    return (
      <div className="list-view">
        <Scroll
          className="listview"
          probeType={3}
          refresh={this.props.refresh}
          onScroll={() => forceCheck()}
        >
          <ul>
            {
              this.props.data.map((v,i) =>
                <li
                  className="list-group"
                  ref="listGroup"
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
                    className="item"
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