import React, {Component} from 'react'
import {NavLink} from 'react-router-dom'

import './navBar.styl'

export default class Navbar extends Component{
  render() {
    return (
      <div className="nav-bar">
        <NavLink to="/recommend" className="nav-item">
          <span className="tab-link">推荐</span>
        </NavLink>
        <NavLink to="/singer" className="nav-item">
          <span className="tab-link">歌手</span>
        </NavLink>
        <NavLink to="/rank" className="nav-item">
          <span className="tab-link">排行榜</span>
        </NavLink>
        <NavLink to="/search" className="nav-item">
          <span className="tab-link">搜索</span>
        </NavLink>
      </div>
    )
  }
}