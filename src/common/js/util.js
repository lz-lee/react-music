export function shuffle(arr) {
 let _arr = arr.slice()
 for (let i = 0; i < _arr.length; i++) {
   let j = getRandomIn(0, i)
   let t = _arr[i]
   _arr[i] = _arr[j]
   _arr[j] = t
 }
 return _arr
}

function getRandomIn(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}