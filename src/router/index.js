import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'

import LazyLoad from 'common/js/lazyLoad'

const Headers = LazyLoad({loader: () => import('components/header/header')})
const NavBar = LazyLoad({loader: () => import('components/navBar/navBar')})
const Recommend = LazyLoad({loader: () => import('components/recommend/recommend')})
const Rank = LazyLoad({loader: () => import('components/rank/rank')})
const Singer = LazyLoad({loader: () => import('components/singer/singer')})
const Search = LazyLoad({loader: () => import('components/search/search')})
const User = LazyLoad({loader: () => import('components/user/user')})

export default class RouteConfig extends Component{
  render() {
    return (
      <Router>
        <div className="app-wrapper">
          <Headers></Headers>
          <NavBar></NavBar>
          <div className="app-view">
            <Switch>
              <Route path="/recommend" component={Recommend}></Route>
              <Route path="/rank" component={Rank}></Route>
              <Route path="/singer" component={Singer}></Route>
              <Route path="/search" component={Search}></Route>
              <Route path="/user" component={User}></Route>
              <Redirect from="/" to="/recommend"></Redirect>
              <Route component={Recommend}></Route>
            </Switch>
          </div>
        </div>
      </Router>
    )
  }
}