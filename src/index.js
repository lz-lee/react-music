import React from 'react'
import ReactDOM from 'react-dom'
import {createStore} from 'redux'
import {Provider} from 'react-redux'
import RouteConfig from 'src/router'
import 'common/styl/index.styl'

// const store = createStore()
ReactDOM.render(
  // <Provider>
    <RouteConfig>

    </RouteConfig>
  // </Provider>
  , document.getElementById('root'));
