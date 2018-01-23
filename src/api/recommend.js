import jsonp from './jsonp'
import {url, commonParams, options} from './config'
// import axios from 'axios'

export function getRecommend() {
  const data = Object.assign({}, commonParams, {
    g_tk: 1124677033,
    uin: 296452017,
    platform: 'h5',
    needNewCode: 1,
    _: +new Date()
  })
  return jsonp(url.slider, data, options)
}

export function getNewAlbum() {
  const data = Object.assign({}, commonParams, {
    g_tk: 1278911659,
		hostUin: 0,
		platform: "yqq",
		needNewCode: 0,
		data: `{"albumlib":
		{"method":"get_album_by_tags","param":
		{"area":1,"company":-1,"genre":-1,"type":-1,"year":-1,"sort":2,"get_tags":1,"sin":0,"num":50,"click_albumid":0},
		"module":"music.web_album_library"}}`
  })

  const option = {
    param: 'callback',
    prefix: 'callback'
  }

  return jsonp(url.newAlbum, data, option)
}