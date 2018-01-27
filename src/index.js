import React from 'react'
import ReactDOM from 'react-dom'
import {createStore, applyMiddleware, compose} from 'redux'
import {Provider} from 'react-redux'
import thunk from 'redux-thunk'
import reducer from 'store/index'
import RouteConfig from 'src/router'
import 'common/styl/index.styl'

const store = createStore(
  reducer,
  compose(applyMiddleware(thunk), window.devToolsExtension ? window.devToolsExtension() : f => f))
ReactDOM.render(
  <Provider store={store}>
    <RouteConfig>

    </RouteConfig>
  </Provider>
  , document.getElementById('root'));
