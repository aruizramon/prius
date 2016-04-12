import React, { Component } from 'react'
import { Provider } from 'react-redux'
import Board from '../containers/Board'
import DevTools from '../containers/DevTools'
import configureStore from '../store/configureStore'

export class App extends Component {
  render() {
    let cardStore = configureStore()
    return (
      <Provider store={cardStore}>
        <div>
          <Board />
          <DevTools />
        </div>
      </Provider>
    );
  }
}
