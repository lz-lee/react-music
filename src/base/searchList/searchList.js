import React from 'react'
import './searchList.styl'
import Proptypes from 'prop-types'

import { CSSTransition, TransitionGroup } from 'react-transition-group'

export default class SearchList extends React.Component{
  constructor(props) {
    super(props)
    this.state = {}
  }

  static propTypes = {
    searches: Proptypes.array
  }

  static defaultProps = {
    searches: []
  }

  deleteOne(v, e) {
    e.stopPropagation()
    this.props.deleteOne(v)
  }

  render() {
    return (
      <div className="search-list">
        <TransitionGroup>
          {
            this.props.searches.map((v, i) =>
              <CSSTransition
                key={v}
                timeout={300}
                classNames="list">
                <li
                onClick={() => this.props.selectItem(v)}
                className="search-item">
                  <span className="text">{v}</span>
                  <span className="icon" onClick={(e) => this.deleteOne(v, e)}>
                    <i className="icon-delete"></i>
                  </span>
                </li>
              </CSSTransition>
            )
          }
        </TransitionGroup>
      </div>
    )
  }
}