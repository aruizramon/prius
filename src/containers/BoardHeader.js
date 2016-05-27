import React, { Component } from 'react';
import { Row, Col, PageHeader } from 'react-bootstrap';
var Select = require('react-select');

export default class Board extends Component {
  render() {
    const options = [
        { value: 'one', label: 'One' },
        { value: 'two', label: 'Two' }
    ];

    function logChange(val) {
        console.log("Selected: " + val);
    }
    return (
      <Row>
        <Col sm={6} md={12}>
          <PageHeader>
            PriusJS <small>an open source Kanban board library</small>
            <form>
              <Select
                name="form-field-name"
                value="one"
                options={options}
                onChange={logChange}
                />
            </form>
          </PageHeader>
        </Col>
      </Row>
    );
  }
}
