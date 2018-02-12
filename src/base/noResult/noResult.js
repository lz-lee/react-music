import React from 'react'

import './noResult.styl'

export default class NoResult extends React.Component {
  render() {
    return (
      <div className="no-result">
        <div className="no-result-icon"></div>
        <p className="no-result-text">{this.props.title}</p>
      </div>
    )
  }
}