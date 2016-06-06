import * as ActionTypes from '../actions';
import _ from 'lodash/fp';
import { combineReducers } from 'redux';


const filters = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.SET_FILTER:
      state.forEach(function(filter) {
        if (filter.id == action.id) {
          filter.values = action.values;
        }
      });
      return [
        ...state,
      ]
    default:
      return state;
  }
};

const card = (state, action) => {
  switch (action.type) {
    case ActionTypes.ADD_CARD:
      return {
        id: action.id,
        title: action.title,
        description: action.description,
        parentList: action.parentList,
      };
    default:
      return state;
  }
};

const cards = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_CARD:
      return [
        ...state,
        card(undefined, action),
      ];
    default:
      return state;
  }
};

const list = (state, action) => {
  switch (action.type) {
    case ActionTypes.ADD_LIST:
      return {
        id: action.id,
        title: action.title,
      };
    default:
      return state;
  }
};

const lists = (state = [], action) => {
  switch (action.type) {
    case ActionTypes.ADD_LIST:
      return [
        ...state,
        list(undefined, action),
      ];
    default:
      return state;
  }
};


const rootReducer = combineReducers({
  lists,
  cards,
  filters,
});

export default rootReducer;
