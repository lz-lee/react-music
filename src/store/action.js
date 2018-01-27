import {set_Disc} from './action-creator'

export function setDisc(data) {
  return dispatch => {
    dispatch(set_Disc(data))
  }
}