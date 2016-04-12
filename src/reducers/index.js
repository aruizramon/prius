import * as ActionTypes from '../actions'
import _ from 'lodash/fp'
import { combineReducers } from 'redux'

function ui(state = null, action) {
  const { type, error } = action

  return state
}

function kanban(state = [], action) {
  switch (action.type) {
    case ActionTypes.ADD_CARD:
      
    default:
      return state
  }
}


const rootReducer = combineReducers({
  ui,
  kanban
})

export default rootReducer
