import React from 'react'
import PropTypes from 'prop-types'
import './songlist.styl'

class SongList extends React.Component {

  static propTypes = {
    songs: PropTypes.array,
    rank: PropTypes.bool,
    select: PropTypes.func.isRequired
  }

  static defaultProps = {
    songs: [],
    rank: false,
    select: null
  }

  selectItem(v, i) {
    if (this.props.select) {
      this.props.select(v, i)
    }
  }

  getRankCls(index) {
    if (index <= 2) {
      return `icon icon${index}`
    } else {
      return 'text'
    }
  }

  getRankText(index) {
    if (index > 2) {
      return index + 1
    }
  }

  render() {
    return (
      <div className="song-list">
        <ul>
          {
            this.props.songs.length
            ? this.props.songs.map((v, i) => (
              <li 
                key={v.mid}
                onClick={() => this.selectItem(v, i)}
                className="item">
                {
                  this.props.rank
                  ? <div className="rank">
                      <span className={this.getRankCls(i)}>{this.getRankText(i)}</span>
                    </div>
                  : null 
                }
                <div className="content">
                  <h2 className="name">{v.name}</h2>
                  <p className="desc">{`${v.singer}·${v.album}`}</p>
                </div>
              </li>
            ))
            : null
          }
          
        </ul>
      </div>
    )
  }
}

export default SongList