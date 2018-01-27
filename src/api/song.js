import jsonp from './jsonp'
import axios from 'axios'
import {url, commonParams} from './config'
import { getUid } from 'common/js/uid'

export function getVkey(songMid, filename) {
  const data = Object.assign({}, commonParams, {
		g_tk: 1278911659,
		hostUin: 0,
		platform: 'yqq',
		needNewCode: 0,
		cid: 205361747,
		uin: 0,
		songmid: songMid,
		filename: filename,
		guid: getUid()
  })
  const option = {
		param: 'callback',
		prefix: 'callback'
	}
	return jsonp(url.songVkey, data, option)
}

export function getLyric(mid) {
	const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}