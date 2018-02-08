import React from 'react'
import Proptypes from 'prop-types'

import './progressCircle.styl'

export default class ProgressCircle extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dashArray: Math.PI * 100
    }
  }

  static propTypes = {
    percent: Proptypes.number,
    radius: Proptypes.number
  }

  static defaultProps = {
    percent: 0,
    radius: 200
  }

  render() {
    let dashOffset = (1 - this.props.percent) * this.state.dashArray
    return (
      <div className="progress-circle">
        <svg width={this.props.radius} height={this.props.radius} viewBox="0 0 100 100" version="1.1" xmlns="http://www.w3.org/2000/svg">
          <circle className="progress-background" r="50" cx="50" cy="50" fill="transparent"/>
          <circle className="progress-bar" r="50" cx="50" cy="50" fill="transparent" strokeDasharray={this.state.dashArray} strokeDashoffset={dashOffset}/>
        </svg>
        {this.props.children}
      </div>
    )
  }
}