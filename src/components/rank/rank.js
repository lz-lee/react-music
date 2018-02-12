import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import {connect} from 'react-redux'

import TopList from 'components/topList/topList'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import {getTopList} from 'api/rank'
import {setTopList} from 'store/action-creator'
import {ERR_OK} from 'api/config'

import LazyLoad, {forceCheck} from 'react-lazyload'

import './rank.styl'

class Rank extends Component{
  constructor(props) {
    super(props)
    this.state = {
      topList: []
    }
  }

  componentDidMount() {
    this._getTopList()
  }

  componentWillReceiveProps(nextProps) {
    const bottom = nextProps.player.playList.length > 0 ? '60px' : 0
    this.refs.rank.style.bottom = bottom
    this.refs.list.refresh()
  }
  
  _getTopList() {
    getTopList().then((res) => {
      if (res.code === ERR_OK) {
        this.setState({
          topList: res.data.topList
        })
      }
    })
  }
  
  selectItem(v) {
    let {match} = this.props
    this.props.setTopList(v)
    this.props.history.push(`${match.url}/${v.id}`)
  }

  render() {
    let {match} = this.props
    return(
      <div className="rank-wrapper" ref="rank">
        <Scroll
          ref="list"
          className="toplist"
          probeType={3}
          data={this.state.topList}
          onScroll={() => forceCheck()}>
          <ul>
            {
              this.state.topList.length ? 
              this.state.topList.map(v => 
                <li
                  key={v.id}
                  className="item"
                  onClick={() => this.selectItem(v)}
                >
                  <div className="icon">
                    <LazyLoad height="100px">
                      <img src={v.picUrl} alt="" width="100" height="100"/>
                    </LazyLoad>
                  </div>
                  <ul className="songlist">
                    {
                      v.songList.map((k, i) => 
                        <li className="song" key={k.songname}>
                          <span>{i + 1}</span>
                          <span>{k.songname}-{k.singername}</span>
                        </li>
                      )
                    }
                  </ul>
                </li>
              ) : null
            }
          </ul>
          {!this.state.topList.length ? <Loading title="正在加载..."></Loading> : null}
        </Scroll>
        <Route path={`${match.url}/:id`} component={TopList}></Route>
      </div>
    )
  }
}

export default connect(state => state, {setTopList})(Rank)