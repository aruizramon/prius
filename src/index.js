import React from 'react';
import { render } from 'react-dom';
import { App } from './containers/App';


var RenderedApp = null;

window.loadKanban = function(initialState) {
  RenderedApp = render(<App initialState={initialState} />,
    document.getElementById('body_div'))
};

window.updateCard = function(card) {
  RenderedApp.updateCard({ card })
};
