export class Song {
  constructor({id, mid, singer, name, duration, img, url}) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.duration = duration
    this.img = img
    this.url = url
  }
}

export function createSong(musicData) {
  return new Song({
      id: musicData.songid,
      mid: musicData.songmid,
      singer: filterSinger(musicData.singer),
      name: musicData.songname,
      duration: musicData.interval,
      image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
      url: ''
  })
}

function filterSinger(singers) {
  return singers.map(v => v.name).join('/')
}