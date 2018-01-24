import React from 'react'
import { getAlbumDetail } from 'api/recommend'
import Header from 'base/header/header'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'

import './album.styl'
import { ERR_OK } from 'api/config'
import { createAlbumByDetail } from 'common/js/album'
import { createSong } from 'common/js/song'

export default class AlbumDetail extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      showLoading: true,
      refresh: false,
      album: {},
      songList: []
    }
  }

  componentDidMount() {
    const {id} = this.props.match.params
    const imageHeight = this.bgImage.clientHeight
    this.scrollWrapper.scrollWrapper.style.top = `${imageHeight}px`
    getAlbumDetail(id).then(res => {
      if (res.code === ERR_OK) {
        let album = createAlbumByDetail(res.data)
        album.desc = res.data.desc
        let songList = res.data.list.map(v => createSong(v))

        this.setState({
          showLoading: false,
          album: album,
          songList: songList
        }, () => {
          this.setState({
            refresh: true
          })
        })
      }
    })
  }

  render() {
    let {album, songList} = this.state
    console.log(this.state)
    return (
      <div className="album-detail-wrapper">
        <Header title={album.name}></Header>
        <div
          className="bg-image"
          style={{backgroundImage: `url(${album.img})`}}
          ref={bgImage => this.bgImage = bgImage}>
          <div className="play-wrapper">
            <div className="play" ref={playBtn => this.playBtn = playBtn}>
              <i className="icon-play"></i>
              <span className="text">随机播放全部</span>
            </div>
          </div>
          <div className="filter" ref={filter => this.filter = filter}></div>
        </div>
        <div className="bg-play"></div>
        <Scroll
          ref={scrollWrapper => this.scrollWrapper = scrollWrapper}
          refresh={this.state.refresh}>
          <div className="album-detail">
            <div className="song-count">专辑 共{songList.length}首</div>
            <div className="song-list">
              {
                songList.map(v =>
                  <div
                    className="song-item"
                    key={v.mid}>
                    <div className="song-name">{v.name}</div>
                    <div className="song-singer">{v.singer}</div>
                  </div>
                )
              }
            </div>
            <div className="album-info">
              <h1 className="title">专辑简介</h1>
              <div className="album-desc">{album.desc}</div>
            </div>
          </div>
        </Scroll>
        <Loading title="正在加载..." show={this.state.showLoading}></Loading>
      </div>
    )
  }
}