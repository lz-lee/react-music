import React from 'react'
import PropTypes from 'prop-types'

import './topTip.styl'

export default class TopTip extends React.Component {
  constructor(props) {
    super(props)
    this.state ={
      show: false
    }
    this.show = this.show.bind(this)
  }
  static propTypes = {
    delay: PropTypes.number
  }

  static defaultProps = {
    delay: 2000
  }
  
  show() {
    this.setState({
      show: true
    }, () => {
      let timer
      clearTimeout(timer)
      timer = setTimeout(() => {
        this.hide()
      }, this.props.delay)
    })
  }

  hide() {
    this.setState({
      show: false
    })
  }

  render() {
    return (
      <div className={"top-tip " + (this.state.show ? 'drop' : '')}>
        {this.props.children}
      </div>
    )
  }
}