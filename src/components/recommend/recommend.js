import React, {Component} from 'react'
import {getRecommend, getNewAlbum} from 'api/recommend'
import * as Album from 'common/js/album'
import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import Swiper from 'swiper'
import LazyLoad, {forceCheck} from 'react-lazyload'
import {ERR_OK} from 'api/config'
import './recommend.styl'
import 'swiper/dist/css/swiper.css'

export default class Recommend extends Component{

  constructor(props) {
    super(props)
    this.state = {
      showLoading: true,
      recommends: [],
      albumList: [],
      refresh: false
    }
  }

  componentDidMount() {
    getRecommend().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          recommends: res.data.slider
        }, () => {
          if (!this.swiper) {
            this.swiper = new Swiper('.swiper-container', {
              loop: true,
              autoplay: 3000,
              autoplayDisableOnInteraction: false,
              pagination: '.swiper-pagination'
            })
          }
        })
      }
    })

    getNewAlbum().then(res => {
      if (res.code === ERR_OK) {
        console.log(res)
        let albumList = res.albumlib.data.list
        // 根据发布时间降序排列
        albumList.sort((a, b) => {
          return +new Date(b.public_time) - +new Date(a.public_time)
        })
        this.setState({
          showLoading: false,
          albumList: albumList
        }, () => {
          this.setState({
            refresh: true
          })
        })
      }
    })
  }

  render() {
    return(
      <div className="recommend-wrapper">
        <Scroll refresh={this.state.refresh} onScroll={(e) => forceCheck()}>
          <div>
            <div className="swiper-container">
              <div className="swiper-wrapper">
                {
                  this.state.recommends.map(v =>
                    <div className="swiper-slide" key={v.linkUrl}>
                      <a href={v.linkUrl} className="slider-nav">
                        <img src={v.picUrl} width="100%" height="100%" alt=""/>
                      </a>
                    </div>
                  )
                }
              </div>
              <div className="swiper-pagination"></div>
            </div>
            <div className="album-wrapper">
                <h1 className="title">最新专辑</h1>
                <div className="album-list">
                  {
                    this.state.albumList.map(v => {
                      let album = Album.createAlbum(v)
                      return (
                        <div className="album-item"
                          key={v.album_mid}
                        >
                          <div className="icon">
                            <LazyLoad>
                              <img src={album.img} width="100%" height="100%" alt=""/>
                            </LazyLoad>
                          </div>
                          <div className="text">
                            <div className="album-name">{album.name}</div>
                            <div className="singer-name">{album.singer}</div>
                            <div className="public-time">{album.publicTime}</div>
                          </div>
                        </div>
                      )
                    })
                  }
                </div>
            </div>
          </div>
        </Scroll>
        <Loading title="正在加载..." show={this.state.showLoading}></Loading>
      </div>
    )
  }
}
