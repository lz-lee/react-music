import React from 'react'
import Proptypes from 'prop-types'
// import {connect} from 'react-redux'

import {search} from 'api/search'
import Scroll from 'base/scroll/scroll'
import Loading from 'base/loading/loading'
import NoResult from 'base/noResult/noResult'

import { createSong, isValidMusic } from 'common/js/song'
import { ERR_OK } from 'api/config'

import './suggest.styl'

const TYPE_SINGER = 'singer'
const perpage = 20

class Suggest extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      result: [],
      hasMore: true,
      page: 1
    }
    this.search = this.search.bind(this)
    this.searchMore = this.searchMore.bind(this)
    this.refresh = this.refresh.bind(this)
  }

  static propTypes = {
    query: Proptypes.string,
    showSinger: Proptypes.bool
  }

  static defaultProps = {
    query: '',
    showSinger: true
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.query) {
      return
    }
    this.search(nextProps)
  }

  search(nextProps) {
    this.setState({
      page: 1,
      hasMore: true
    }, () => {
      this.refs.suggest.scrollTo(0, 0)
      search(nextProps.query, this.state.page, nextProps.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.setState({
            result: this._genResult(res.data)
          })
          this.checkMove(res.data)
        }
      })
    })
  }

  searchMore() {
    if (!this.state.hasMore) {
      return
    }
    let page = this.state.page
    page++
    this.setState({
      page: page
    }, () => {
      search(this.props.query, this.state.page, this.props.showSinger, perpage).then(res => {
        if (res.code === ERR_OK) {
          this.setState((prevState) => {
            return {
              result: this.state.result.concat(this._genResult(res.data))
            }
          })
          this.checkMove(res.data)
        }
      })
    })
  }

  checkMove(data) {
    const song = data.song
    if (!song.list.length || (song.curnum + (song.curpage - 1) * perpage) >= song.totalnum) {
      this.setState({
        hasMore: false
      })
    }
  }

  refresh() {
    this.refs.suggest.refresh()
  }

  _genResult(data) {
    let ret = []
    if (data.zhida && data.zhida.singerid && this.state.page === 1) {
      ret.push({...data.zhida, ...{type: TYPE_SINGER}})
    }
    if (data.song) {
      ret = ret.concat(this._normalizeSongs(data.song.list))
    }
    return ret
  }

  _normalizeSongs(list) {
    let ret = []
    list.forEach((musicData) => {
      if (isValidMusic(musicData)) {
        ret.push(createSong(musicData))
      }
    })
    return ret
  }

  getIconCls(v) {
    if (v.type === TYPE_SINGER) {
      return 'icon-mine'
    } else {
      return 'icon-music'
    }
  }

  getDisplayName(v) {
    if (v.type === TYPE_SINGER) {
      return {__html: v.singername}
    } else {
      return {__html: `${v.name}-${v.singer}`}
    }
  }

  render() {
    return (
      <Scroll
        ref="suggest"
        className="suggest"
        probeType={3}
        data={this.state.result}
        scrollToEnd={this.searchMore}
        onBeforeScroll={this.props.onBeforeScroll}
        >
        <ul className="suggest-list">
          {
            this.state.result.map((v, i) =>
              <li
                onClick={() => this.props.selectItem(v)}
                className="suggest-item"
                key={v.mid + v.name + i}>
                <div className="icon">
                  <i className={this.getIconCls(v)}></i>
                </div>
                <div className="name">
                  <p className="text" dangerouslySetInnerHTML={this.getDisplayName(v)}></p>
                </div>
              </li>
            )
          }
          <div className="loading">
            {this.state.hasMore ? <Loading title=""></Loading> : null}
          </div>
        </ul>
        <div className="no-result-wrapper">
          { !this.state.hasMore && !this.state.result.length ? <NoResult title="抱歉，暂无搜索结果"></NoResult> : null}
        </div>
      </Scroll>
    )
  }
}

export default Suggest