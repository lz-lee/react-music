import React from 'react'
import PropTypes from 'prop-types'

import './searchBox.styl'

class SearchBox extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      query: ''
    }
    this.clear = this.clear.bind(this)
    this.setQuery = this.setQuery.bind(this)
  }

  static propTypes = {
    placeHolder: PropTypes.string,
    onInput: PropTypes.func
  }

  static defaultProps = {
    placeHolder: '搜索歌曲、歌手',
    onInput: null
  }

  onInput(e) {
    const query = e.target.value
    this.setState({
      query: query.trim()
    })
    console.log(this.props)
    this.props.onInput(query)
  }

  clear() {
    this.setState({
      query: ''
    })
    this.refs.query.value = ''
    this.props.onInput()
  }

  blur() {
    this.refs.query.blur()
  }

  setQuery(query) {
    this.setState({
      query: query.trim()
    })
    this.refs.query.value = query
    // 关于query的操作都在该组件里
    this.props.onInput(query)
  }

  render() {
    return (
      <div className="search-box">
        <i className="icon-search"></i>
        <input
          type="text"
          ref="query"
          className="box"
          onKeyUp={(e) => this.onInput(e)}
          placeholder={this.props.placeHolder}/>
        {
          this.state.query ? <i className="icon-dismiss" onClick={this.clear}></i> : null
        }
      </div>
    )
  }
}

export default SearchBox