import React, {Component} from 'react'
import Loadable from 'react-loadable'

export default (opts) => {
  const MyComponent = Loadable({
    loading: () => null,
    ...opts
  })

  class LazyLoad extends Component {
    render() {
      return <MyComponent {...this.props}/>
    }
  }
  return LazyLoad
}