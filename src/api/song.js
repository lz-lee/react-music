import jsonp from './jsonp'
import {url, commonParams} from './config'

export function getSongVkey(songMid) {
  const data = Object.assign({}, commonParams, {
		g_tk: 1278911659,
		hostUin: 0,
		platform: 'yqq',
		needNewCode: 0,
		cid: 205361747,
		uin: 0,
		songmid: songMid,
		filename: `C400${songMid}.m4a`,
		guid: 3655047200
  })
  const option = {
		param: 'callback',
		prefix: 'callback'
	}
	return jsonp(url.songVkey, data, option)
}