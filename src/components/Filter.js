import React, { Component } from 'react';
import { connect } from 'react-redux';
var SimpleSelect = require('react-selectize').SimpleSelect;
var MultiSelect = require('react-selectize').MultiSelect;


export default class Filter extends Component {
  constructor(props) {
    super(props);
    this.get_options = this.get_options.bind(this);
  }
  get_options(field) {
    return false;
  }
  render() {
    var self = this;
    const { title, field, type, options } = this.props
//    var options = this.get_options(field);
    if (type == "SimpleSelect") {
      return <SimpleSelect
                options={options}
                placeholder={title}
                onValueChange = {function(value){
                  self.setState(value);
                }}
              />
    } else if (type == "MultiSelect") {
      return <MultiSelect
                options={options}
                placeholder={title}
                onValuesChange = {function(values){
                  self.setState(values);
                }}
              />
    }
  }
}
