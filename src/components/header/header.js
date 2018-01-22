import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'
import './header.styl'

export default class Headers extends Component{
  render() {
    return (
      <div className="m-header">
        <div className="icon"></div>
        <h1 className="text">React-Music</h1>
        <NavLink to="/user" className="mine">
          <i className="icon-mine"></i>
        </NavLink>
      </div>
    )
  }
}