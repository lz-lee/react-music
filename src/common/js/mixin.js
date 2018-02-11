import React from 'react'

export const playListHoc = (wrapperComponent) => {
  class PlayHoc extends React.Component {
    constructor(props) {
      super(props)
      this.state = {}
    }

    componentDidMount() {
      console.log('hoc mouted')  
    }

    render() {
      return (
        <wrapperComponent {...this.props}/>
      )
    }
  }
  return PlayHoc
}