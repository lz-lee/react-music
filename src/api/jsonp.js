import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (err) {
        reject(err)
      } else {
        resolve(data)
      }
    })
  })
}

function param(data) {
  let params = []
  for (let i in data) {
    let val = data[i] !== undefined ? data[i] : ''
    params.push(`${i}=${encodeURIComponent(val)}`)
  }
  return params.join('&')
}