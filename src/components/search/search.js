import React, {Component} from 'react'

import SearchBox from 'base/searchBox/searchBox'
import Scroll from 'base/scroll/scroll'

import {getHotKey} from 'api/search.js'
import {ERR_OK} from 'api/config'
import './search.styl'

export default class Search extends Component{
  constructor(props) {
    super(props)
    this.state = {
      hotKey: []
    }
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


  render() {
    return(
      <div className="search-wrapper">
        <div className="search-box-wrapper">
          <SearchBox ref="searchBox" />
        </div>
        <div className="shortcut-wrapper">
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
      </div>
    )
  }
}
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