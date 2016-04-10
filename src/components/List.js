import React, { Component, PropTypes } from 'react'
import { Panel } from 'react-bootstrap';
import Card from '../components/Card'

export default class List extends Component {
  render() {
    const { title } = this.props

    return (
      <Panel header={title}>
        <Card title="I'm card" description="oh hey" />
      </Panel>
    );
  }
}

List.propTypes = {
  title: PropTypes.string.isRequired,
}
