import React, { Component } from 'react';
import { Button, ButtonToolbar, Panel, Grid, Row, Col, Clearfix }
  from 'react-bootstrap';

export class App extends Component {
  render() {
    return (
      <Grid>
        <Row>
          <Col sm={6} md={3}>
            <Panel header="Initial Contact">
              <Panel header="I like waffle" bsStyle="primary">
                random shit
              </Panel>
            </Panel>
          </Col>
          <Col sm={6} md={3}>
            <Panel header="Initial Contact">
              <Panel header="I like waffle" bsStyle="primary">
                random shit
              </Panel>
            </Panel>
          </Col>
          <Col sm={6} md={3}>
            <Panel header="Initial Contact">
              <Panel header="I like waffle" bsStyle="primary">
                random shit
              </Panel>
            </Panel>
          </Col>
          <Col sm={6} md={3}>
            <Panel header="Initial Contact">
              <Panel header="I like waffle" bsStyle="primary">
                random shit
              </Panel>
            </Panel>
          </Col>
        </Row>
      </Grid>
    );
  }
}
