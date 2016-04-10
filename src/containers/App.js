import React, { Component } from 'react'
import { Button, ButtonToolbar, Panel, Grid, Row, Col, Clearfix }
  from 'react-bootstrap'
import List from '../components/List'

export class App extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col sm={6} md={3}>
            <List title="Stage 1" />
          </Col>
          <Col sm={6} md={3}>
            <List title="Stage 2" />
          </Col>
          <Col sm={6} md={3}>
            <List title="Stage 3" />
          </Col>
          <Col sm={6} md={3}>
            <List title="Stage 4" />
          </Col>
        </Row>
      </Grid>
    );
  }
}
