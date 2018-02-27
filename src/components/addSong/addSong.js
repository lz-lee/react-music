import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'

import {CSSTransition} from 'react-transition-group'

import SearchBox from 'base/searchBox/searchBox'
import Suggest from 'components/suggest/suggest'
import Switch from 'base/switch/switch'
import Scroll from 'base/scroll/scroll'
import SongList from 'base/songlist/songlist'
import SearchList from 'base/searchList/searchList'

import {debounce} from 'common/js/util'
import './addSong.styl'

class AddSong extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      query: '',
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
    this.blurInput = this.blurInput.bind(this)
    this.switch = this.switch.bind(this)
  }

  static propTypes = {
    showFlag: PropTypes.bool
  }

  static defaultProps = {
    showFlag: false
  }

  hide(e) {
    e.stopPropagation()
    this.props.hide()
  }

  exit(el) {
    // hack 由于render的style直接改变为none，导致动画无效
    el.style.display = 'block'
  }

  exited(el) {
    el.style.display = 'none'
  }

  onQueryChange = debounce((query) => {
    this.setState({
      query
    })
  }, 300)

  switch(i) {
    this.setState({
      currentIndex: i
    })
  }

  blurInput() {
    this.refs.searchBox.blur()
  }

  selectSuggest() {

  }

  selectSong() {

  }

  addQuery(query) {
    this.refs.searchBox.setQuery(query)
  }

  render() {
    const {playHistory, searchHistory} = this.props
    return (
      <CSSTransition
        in={this.props.showFlag}
        timeout={200}
        classNames="fade"
        onExit={(el) => this.exit(el)}
        onExited={(el) => this.exited(el)}>
        <div
          className="add-song"
          style={{'display': this.props.showFlag ? 'block' : 'none'}}
          onClick={(e) => e.stopPropagation()}>
          <div className="header">
            <h1 className="title">添加歌曲到列表</h1>
            <div className="close" onClick={this.hide}>
              <i className="icon-close"></i>
            </div>
          </div>
          <div className="search-box-wrapper">
            <SearchBox
              ref="searchBox"
              placeHolder="搜索歌曲"
              onInput={this.onQueryChange}></SearchBox>
          </div>
          <div className="shortcut" style={{"display": !this.state.query ? '' : 'none'}}>
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
                    <SongList songs={playHistory} select={this.selectSong}></SongList>
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
                        selectItem={this.addQuery}
                        searches={searchHistory}></SearchList>
                    </div>
                  </Scroll>
              }
            </div>
          </div>
          <div className="search-result" style={{'display': this.state.query ? '' : 'none'}}>
            <Suggest
              query={this.state.query}
              showSinger={false}
              selectItem={this.selectSuggest}
              onBeforeScroll={this.blurInput}></Suggest>
          </div>
        </div>
      </CSSTransition>
    )
  }
}

AddSong = connect(state => state)(AddSong)

export default AddSong