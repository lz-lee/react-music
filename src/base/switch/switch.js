import React from 'react'
import PropTypes from 'prop-types'

import './switch.styl'

export default class Switch extends React.Component {
  constructor(props) {
    super(props)
    this.state = {

    }
  }

  static propTypes = {
    switches: PropTypes.array,
    currentIndex: PropTypes.number,
    switch: PropTypes.func
  }

  static defaultProps = {
    switches: [],
    currentIndex: 0,
    switch: null
  }

  render() {
    return (
      <div className="switches">
        {
          this.props.switches.map((v, i) =>
            <li
              key={v.name}
              className={"switch-item " + (i === this.props.currentIndex ? 'active' : '')}
              onClick={() => this.props.switch(i)}>
              <span>{v.name}</span>
            </li>
          )
        }
      </div>
    )
  }
}