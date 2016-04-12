import React, { Component } from 'react'
import { Grid, Row, Col, Clearfix, PageHeader }
  from 'react-bootstrap'
import List from '../components/List'
import Form from '../components/Form'
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';

@DragDropContext(HTML5Backend)
export default class Board extends Component {
  render() {
    return (
      <Grid>
      <Row>
        <Col sm={6} md={12}>
          <PageHeader>
            PriusJS <small>an open source Kanban board library</small>
          </PageHeader>
        </Col>
      </Row>
        <Row>
          <Col sm={6} md={3}>
            <List key={1} title="Backlog" />
          </Col>
          <Col sm={6} md={3}>
            <List key={2} title="Next" />
          </Col>
          <Col sm={6} md={3}>
            <List key={3} title="Active" />
          </Col>
          <Col sm={6} md={3}>
            <List key={4} title="Done" />
          </Col>
        </Row>
        <Row>
          <Col sm={6} md={12}>
            <Form />
          </Col>
        </Row>
      </Grid>
    );
  }
}
