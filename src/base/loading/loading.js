import React from 'react'
import './loading.styl'

export default class Loading extends React.Component{
  render() {
    return (
      <div className="loading-content" style={{display: this.props.showLoading ? '' : 'none'}}>
        <div className="loading-wrapper">
          <img src={require('common/image/loading.gif')} width="36" height="36" alt=""/>
          <p className="desc">{this.props.title}</p>
        </div>
      </div>
    )
  }
}