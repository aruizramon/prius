import React from 'react';
import { render } from 'react-dom';
import { App } from './containers/App';

window.load_my_kanban = function(initialState) {
  render(<App initialState={initialState} />, document.getElementById('body_div'));
};
