import React from 'react'
import {withRouter} from 'react-router-dom'
import './header.styl'

class Header extends React.Component {

  constructor() {
    super()
    this.goBack = this.goBack.bind(this)
  }

  goBack() {
    this.props.history.goBack()
  }

  render() {
    return (
      <div className="header-wrapper">
        <span className="header-back" onClick={this.goBack}>
          <i className="icon-back"></i>
        </span>
        <div className="title">{this.props.title}</div>
      </div>
    )
  }
}

export default withRouter(Header)