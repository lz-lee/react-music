export class Album {
  constructor(id, mid, name, img, singer, publicTime) {
    this.id = id
    this.mid = mid
    this.name = name
    this.img = img
    this.singer = singer
    this.publicTime = publicTime
  }
}

export function createAlbum(data) {
  return new Album(
    data.album_id,
    data.album_mid,
    data.album_name,
    `http://y.gtimg.cn/music/photo_new/T002R300x300M000${data.album_mid}.jpg?max_age=2592000`,
    filterSinger(data.singers),
    data.public_time
  )
}

export function createAlbumByDetail(data) {
  return new Album(
    data.id,
    data.mid,
    data.name,
    `http://y.gtimg.cn/music/photo_new/T002R300x300M000${data.mid}.jpg?max_age=2592000`,
    data.singername,
    data.aDate
  )
}

function filterSinger(singers) {
  return singers.map(v => v.singer_name).join('/')
}