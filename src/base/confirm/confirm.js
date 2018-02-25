import React from 'react'
import Proptypes from 'prop-types'

import './confirm.styl'
export default class Confrim extends React.Component {

  constructor(props) {
    super(props)
    this.state = {
      showFlag: false
    }
  }

  static propTypes = {
    text: Proptypes.string,
    confirmBtnText: Proptypes.string,
    cancelBtnText: Proptypes.string
  }

  static defaultProps = {
    text: '',
    cancelBtnText: '取消',
    confirmBtnText: '确认'
  }

  show() {
    this.setState({
      showFlag: true
    })
  }

  hide() {
    this.setState({
      showFlag: false
    })
  }

  confirm() {
    this.hide()
    this.props.confirm()
  }

  cancel() {
    this.hide()
  }

  render() {
    return (
      <div className={"confirm " + (this.state.showFlag ? 'confirm-fade-enter-active' : '')} style={{'display': !this.state.showFlag ? 'none' : 'block'}}>
        <div className="confirm-wrapper">
          <div className="confirm-content">
            <p className="text">{this.props.text}</p>
            <div className="operate">
              <div className="operate-btn left" onClick={() => this.cancel()}>{this.props.cancelBtnText}</div>
              <div className="operate-btn" onClick={() => this.confirm()}>{this.props.confirmBtnText}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}