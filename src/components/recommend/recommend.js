import React, {Component} from 'react'
import {connect} from 'react-redux'
import {Route} from 'react-router-dom'

import {getRecommend, getDiscList} from 'api/recommend'
import {ERR_OK} from 'api/config'

import Loading from 'base/loading/loading'
import Scroll from 'base/scroll/scroll'
import Swiper from 'swiper'

import LazyLoadComponent from 'common/js/lazyLoad'
import LazyLoad, {forceCheck} from 'react-lazyload'

import {setDisc} from 'store/action'

import './recommend.styl'
import 'swiper/dist/css/swiper.css'

const Disc = LazyLoadComponent({loader: () => import('components/disc/disc')})

class Recommend extends Component{

  constructor(props) {
    super(props)
    this.state = {
      refresh: false,
      recommends: [],
      discList: []
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

    getDiscList().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          discList: res.data.list
        })
      }
    })
  }

  componentWillUpdate (nextProps, nextState) {
    console.log('will update')
  }
  
  componentDidUpdate(prevProps, prevState) {
    console.log('did update')
  }

  selectAlbum(v) {
    const {match} = this.props
    const url = `${match.url}/${v.dissid}`
    this.props.setDisc(v)
    this.props.history.push(url)
  }

  render() {
    let {match} = this.props
    return(
      <div className="recommend-wrapper">
        <Scroll
          probeType={3}
          data={this.state.discList}
          onScroll={() => forceCheck()}>
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
            <div className="recommend-list">
                <h1 className="list-title">热门歌单推荐</h1>
                <ul>
                  {
                    this.state.discList.length ? this.state.discList.map(v =>{
                      return (
                        <li
                        onClick={() => this.selectAlbum(v)}
                        key={v.dissname}
                        className="item">
                          <div className="icon">
                            <LazyLoad>
                              <img src={v.imgurl} width="60" height="60" alt=""/>
                            </LazyLoad>
                          </div>
                          <div className="text">
                            <h2 className="name">{v.creator.name}</h2>
                            <p className="desc">{v.dissname}</p>
                          </div>
                        </li>
                      )
                    }) : null
                  }
                </ul>
            </div>
          </div>
        </Scroll>
        {!this.state.discList.length ? <Loading title="正在加载..."></Loading> : null}
        <Route path={`${match.url}/:id`} component={Disc}></Route>
      </div>
    )
  }
}

Recommend = connect(state => state, {setDisc})(Recommend)

export default Recommend