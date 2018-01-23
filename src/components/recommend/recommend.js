import React, {Component} from 'react'
import {getRecommend, getNewAlbum} from 'api/recommend'
import {ERR_OK} from 'api/config'
import Slider from 'base/slider/slider'

import './recommend.styl'

export default class Recommend extends Component{

  constructor(props) {
    super(props)
    this.state = {
      recommends: []
    }
  }

  componentDidMount() {
    getRecommend().then(res => {
      if (res.code === ERR_OK) {
        this.setState({
          recommends: res.data.slider
        })
      }
    })
  }

  render() {
    return(
      <div className="Recommend-wrapper">
        <div className="slider-content">
          <Slider
            ref={slider => this.slider = slider}
          >
            {
              this.state.recommends.map((v, i) =>
                <a
                href={v.linkUrl}
                key={v.linkUrl}>
                  <img src={v.picUrl} className="needsclick" alt=""/>
                </a>
              )
            }
          </Slider>
        </div>
      </div>
    )
  }
}
