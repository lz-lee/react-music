import React, {Component} from 'react'
import {Route} from 'react-router-dom'
import {connect} from 'react-redux'

import SearchBox from 'base/searchBox/searchBox'
import Scroll from 'base/scroll/scroll'
import Suggest from 'components/suggest/suggest'
import SingerDetail from 'base/singerDetail/singerDetail'

import {getHotKey} from 'api/search.js'
import Singers from 'common/js/singer'
import {set_singer} from 'store/action-creator'

import {ERR_OK} from 'api/config'
import './search.styl'

const TYPE_SINGER = 'singer'

class Search extends Component{
  constructor(props) {
    super(props)
    this.state = {
      hotKey: [],
      query: '',
      refreshDelay: 120
    }
    this.selectItem = this.selectItem.bind(this)
  }

  componentDidMount() {
    getHotKey().then((res) => {
      if (res.code === ERR_OK) {
        this.setState({
          hotKey: res.data.hotkey.slice(0, 10)
        })
      }
    })
  }

  addQuery(query) {
    this.refs.searchBox.setQuery(query)
  }

  onQueryChange = (query) => {
    this.setState({
      query
    })
  }

  selectItem(v) {
    if (v.type === TYPE_SINGER) {
      const singer = new Singers({
        id: v.singermid,
        name: v.singername
      })
      const {match} = this.props
      const url = `${match.url}/${singer.id}`
      this.props.history.push(url)
      this.props.set_singer(singer)
    }
  }

  render() {
    const {match} = this.props
    return(
      <div className="search-wrapper">
        <div className="search-box-wrapper">
          <SearchBox ref="searchBox" onInput={this.onQueryChange}/>
        </div>
        {
          <div className="shortcut-wrapper" style={{"display": !this.state.query ?'block' : 'none'}}>
            <Scroll
              className="shortcut"
              probeType={3}
            >
              <div>
                <div className="hot-key">
                  <h1 className="title">热门搜索</h1>
                  <ul>
                    {
                      this.state.hotKey.map(v =>
                        <li className="item" key={v.k} onClick={() => this.addQuery(v.k)}>
                          <span>{v.k}</span>
                        </li>
                      )
                    }
                  </ul>
                </div>
              </div>
            </Scroll>
          </div>
        }
        {
          <div className="search-result" ref="searchResult" style={{'display': this.state.query ? 'block' : 'none'}}>
            <Suggest
              selectItem={this.selectItem}
              query={this.state.query}
              ref="suggest">

            </Suggest>
          </div>
        }
        <Route path={`${match.url}/:id`} component={SingerDetail}></Route>
      </div>
    )
  }
}
export default connect(null, {set_singer})(Search)
                    // {
                    //   this.props.searchHistory.length > 0 ?
                    //   <div className="search-history">
                    //     <h1 className="title">
                    //       <span className="text">搜索历史</span>
                    //       <span className="clear" onClick={this.showConfirm}>
                    //         <i className="icon-clear"></i>
                    //       </span>
                    //     </h1>
                    //   </div>
                    //   : null
                    // }