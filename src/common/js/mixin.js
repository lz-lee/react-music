import React from 'react'

export const playListHoc = (wrapperComponent) => {
  class PlayHoc extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
    }

    render() {
      return (
        <wrapperComponent {...this.props}/>
      )
    }
  }
  return PlayHoc
}