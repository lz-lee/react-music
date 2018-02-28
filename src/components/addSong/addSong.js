import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import SearchBox from 'base/searchBox/searchBox'
import Suggest from 'components/suggest/suggest'
import Switch from 'base/switch/switch'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/songlist/songlist'
import SearchList from 'base/searchList/searchList'
import TopTip from 'base/topTip/topTip'

import {Song} from 'common/js/song'

import {insertSong} from 'store/action'

import {searchHoc} from 'common/js/mixin'

import './addSong.styl'

class AddSong extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      switches: [
        {
          name: '最近播放'
        },
        {
          name: '搜索历史'
        }
      ],
      currentIndex: 0
    }
    this.hide = this.hide.bind(this)
    this.switch = this.switch.bind(this)
    this.refreshList = this.refreshList.bind(this)
    this.selectSong = this.selectSong.bind(this)
    this.selectSuggest = this.selectSuggest.bind(this)
  }

  static propTypes = {
    showFlag: PropTypes.bool
  }

  static defaultProps = {
    showFlag: false
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.showFlag) {
      this.refreshList()
    }
  }
  
  hide(e) {
    e.stopPropagation()
    this.props.hide()
  }

  switch(i) {
    this.setState({
      currentIndex: i
    })
  }

  selectSuggest(v) {
    this.refs.topTip.show()
    this.props.insertSong(v)
    this.props.saveSearch()
  }

  selectSong(song, index) {
    if (index !== 0) {
      this.props.insertSong(new Song(song))
      this.refs.topTip.show()
    }
  }

  refreshList() {
    setTimeout(() => {
      if (this.state.currentIndex === 0) {
        this.refs.songList.refresh()
      } else {
        this.refs.searchList.refresh()
      }
    })
  }

  render() {
    const {playHistory, searchHistory} = this.props
    return (
      <div
        className={"add-song " + (this.props.showFlag ? 'fade' : '')}
        onClick={(e) => e.stopPropagation()}>
        <div className="header">
          <h1 className="title">添加歌曲到列表</h1>
          <div className="close" onClick={this.hide}>
            <i className="icon-close"></i>
          </div>
        </div>
        <div className="search-box-wrapper">
          <SearchBox
            ref={this.props.searchRef}
            placeHolder="搜索歌曲"
            onInput={this.props.onQueryChange}></SearchBox>
        </div>
        <div className="shortcut" style={{"display": !this.props.query ? '' : 'none'}}>
          <Switch
            switches={this.state.switches}
            currentIndex={this.state.currentIndex}
            switch={this.switch}
          ></Switch>
          <div className="list-wrapper">
            {
              this.state.currentIndex === 0
              ?
                <Scroll
                  ref="songList"
                  probeType={3}
                  className="list-scroll"
                  data={playHistory}
                >
                  <div className="list-inner">
                    <SongList songs={playHistory} select={this.selectSong}></SongList>
                  </div>
                </Scroll>
              :
                <Scroll
                  ref="searchList"
                  probeType={3}
                  className="list-scroll"
                  data={searchHistory}
                >
                  <div className="list-inner">
                    <SearchList
                      deleteOne={this.props.deleteSearchHistory}
                      selectItem={this.props.addQuery}
                      searches={searchHistory}></SearchList>
                  </div>
                </Scroll>
            }
          </div>
        </div>
        <div className="search-result" style={{'display': this.props.query ? '' : 'none'}}>
          <Suggest
            query={this.props.query}
            showSinger={false}
            selectItem={this.selectSuggest}
            onBeforeScroll={this.props.blurInput}></Suggest>
        </div>
        <TopTip
          ref="topTip"
        >
          <div className="tip-title">
            <i className="icon-ok"></i>
            <span className="text">1首歌曲已经添加到播放列表</span>
          </div>
        </TopTip>
      </div>
    )
  }
}

AddSong = searchHoc(connect(null, {insertSong})(AddSong))

export default AddSong