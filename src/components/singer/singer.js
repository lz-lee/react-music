import React, {Component} from 'react'
import {Route} from 'react-router-dom'
// import {connect} from 'react-redux'

import ListView from 'base/listview/listview'
import SingerDetail from 'base/singerDetail/singerDetail'

import {getSingerList} from 'api/singer'
import Singers from 'common/js/singer'
import {ERR_OK} from 'api/config'

import './singer.styl'

const HOT_NAME = '热门'

const HOT_LEN = 10

export default class Singer extends Component{
  constructor(props) {
    super(props)
    this.state = {
      refresh: false,
      singers: []
    }
    this._getSignerList = this._getSignerList.bind(this)
  }

  componentDidMount() {
    this._getSignerList()  
  }

  _getSignerList() {
    getSingerList().then((res) => {
      if (res.code === ERR_OK) {
        console.log(this._normalizeSinger(res.data.list))
        this.setState({
          singers: this._normalizeSinger(res.data.list)
        }, () => {
          this.setState({
            refresh: true 
          })
        })
      }
    })
  }

  _normalizeSinger(list) {
    let map = {
      hot: {
        title: HOT_NAME,
        items: []
      }
    }

    list.forEach((item, index) => {
      if (index < HOT_LEN) {
        map.hot.items.push(new Singers({
          name: item.Fsinger_name,
          id: item.Fsinger_mid
        }))
      }
      const key = item.Findex
      if (!map[key]) {
        map[key] = {
          title: key,
          items: []
        }
      }
      map[key].items.push(new Singers({
        name: item.Fsinger_name,
        id: item.Fsinger_mid
      }))
    })

    let ret = []
    let hot = []
    for (let key in map) {
      let val = map[key]

      if(val.title.match(/[a-zA-Z]/)) {
        ret.push(val)
      } else if (val.title === HOT_NAME) {
        hot.push(val)
      }
    }
    ret.sort((a, b) => {
      return a.title.charCodeAt(0) - b.title.charCodeAt(0)
    })
    return hot.concat(ret)
  }

  selectSinger(v) {
    const {match} = this.props
    const url = `${match.url}/${v.dissid}`
    
    this.props.history.push(url)
  }
  
  render() {
    let {match} = this.props
    return(
      <div className="singer-wrapper" ref="singer">
        <ListView data={this.state.singers} refresh={this.state.refresh}></ListView>
        <Route path={`${match.url}/:id`} component={SingerDetail}></Route>
      </div>
    )
  }
}