import React, {Component} from 'react'
import {BrowserRouter as Router, Route, Switch, Redirect} from 'react-router-dom'

import LazyLoadComponent from 'common/js/lazyLoad'

const Headers = LazyLoadComponent({loader: () => import('base/header/header')})
const NavBar = LazyLoadComponent({loader: () => import('components/navBar/navBar')})
const Recommend = LazyLoadComponent({loader: () => import('components/recommend/recommend')})
const Rank = LazyLoadComponent({loader: () => import('components/rank/rank')})
const Singer = LazyLoadComponent({loader: () => import('components/singer/singer')})
const Search = LazyLoadComponent({loader: () => import('components/search/search')})
const User = LazyLoadComponent({loader: () => import('components/user/user')})

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