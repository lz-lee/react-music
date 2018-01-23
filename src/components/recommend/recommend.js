import React, {Component} from 'react'
import {getRecommend, getNewAlbum} from 'api/recommend'
import * as Album from 'common/js/album'
import Scroll from 'base/scroll/scroll'
import './recommend.styl'
import Swiper from 'swiper'
import 'swiper/dist/css/swiper.css'
import {ERR_OK} from 'api/config'

export default class Recommend extends Component{

  constructor(props) {
    super(props)
    this.state = {
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
          albumList: albumList,
          refresh: true
        })
      }
    })
  }

  render() {
    return(
      <div className="recommend-wrapper">
        <Scroll refresh={this.state.refresh}>
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
                            <img src={album.img} width="100%" height="100%" alt=""/>
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
      </div>
    )
  }
}
