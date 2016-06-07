import React, { Component } from 'react';
import { Grid } from 'react-bootstrap';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import BoardHeader from '../containers/BoardHeader';
import ContentCreator from '../containers/ContentCreator';
import Lists from '../containers/Lists';

@DragDropContext(HTML5Backend)
export default class Board extends Component {
  render() {
    return (
      <Grid fluid>
        <br />
        <br />
        <Lists />

      </Grid>
    );
  }
}
