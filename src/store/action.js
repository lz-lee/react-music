import * as actions from './action-creator'

export function setDisc(data) {
  return dispatch => {
    dispatch(actions.set_Disc(data))
  }
}

export function setSinger(data) {
  return dispatch => {
    dispatch(actions.set_singer(data))
  }
}