import React, { Component } from 'react';
import { Row, Col, PageHeader, Select } from 'react-bootstrap';
var SimpleSelect = require('react-selectize').SimpleSelect;

const DropdownFilter = React.createClass({
  render: function(){
    var self = this,
      options = ["apple", "mango", "grapes", "melon", "strawberry"].map(function(fruit){
        return {label: fruit, value: fruit}
      });
      return <SimpleSelect
                options={options}
                placeholder="Select a fruit"
                onValueChange = {function(values){
                  console.log(values);
                }}
              ></SimpleSelect>
  }
});

export default DropdownFilter;



export default class Board extends Component {
  render() {
    function logChange(val) {
        console.log("Selected: " + val);
    }
    return (
      <Row>
        <Col sm={6} md={12}>
          <PageHeader>
            PriusJS <small>an open source Kanban board library</small>
          </PageHeader>
          <Row>
            <DropdownFilter />
          </Row>
        </Col>
      </Row>
    );
  }
}
