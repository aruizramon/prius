import React, { Component, PropTypes } from 'react'
import { Panel } from 'react-bootstrap';
import Card from '../components/Card'
import ItemTypes from '../constants/ItemTypes'
import { DragSource, DropTarget } from 'react-dnd'

const listTarget = {
  drop(props, monitor, component) {
    alert('dropped');
  }
}

@DropTarget(ItemTypes.CARD, listTarget, (connect) => ({
  connectDropTarget: connect.dropTarget()
}))
export default class List extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    connectDropTarget: PropTypes.func.isRequired
  }

  render() {
    const { title } = this.props
    const { connectDropTarget } = this.props

    return connectDropTarget(
      <div className="kanban-list">
        <Panel header={title}>
          {/*<Card title="I'm card" description="oh hey" />*/}
        </Panel>
      </div>
    );
  }
}
