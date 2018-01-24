import React from 'react'
import { getAlbumDetail } from 'api/recommend'
import Header from 'base/header/header'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'

import './album.styl'
import { ERR_OK } from 'api/config'
import { createAlbumByDetail } from 'common/js/album'
import { createSong } from 'common/js/song'
import {getSongVkey} from 'api/song'
import {CSSTransition} from 'react-transition-group'

export default class AlbumDetail extends React.Component{
  constructor(props) {
    super(props)
    this.state = {
      show: false,
      showLoading: true,
      refresh: false,
      album: {},
      songList: []
    }
  }

  componentDidMount() {
    // 切换子路由的动画未做
    this.setState({
      show: true
    })
    const {id} = this.props.match.params
    const imageHeight = this.bgImage.clientHeight
    this.scrollWrapper.scrollWrapper.style.top = `${imageHeight}px`
    getAlbumDetail(id).then(res => {
      if (res.code === ERR_OK) {
        let album = createAlbumByDetail(res.data)
        album.desc = res.data.desc
        let songList = res.data.list.map(v => {
          let song =createSong(v)
          // 获取vkey 是异步的
          this.getSongUrl(song, v.songmid)
          return song
        })

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

  async getSongUrl(song, mid) {
    await getSongVkey(mid).then(res => {
      if (res.code === ERR_OK) {
        let item = res.data.items[0]
        song.url = `http://dl.stream.qqmusic.qq.com/${item.filename}?vkey=${item.vkey}&guid=3655047200&fromtag=66`
      }
    })
  }

  render() {
    let {album, songList} = this.state
    return (
      <CSSTransition
        in={this.state.show}
        timeout={300}
        classNames="fade"
        >
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
      </CSSTransition>
    )
  }
}