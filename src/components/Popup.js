import React, { Component, PropTypes } from 'react';
import { Panel } from 'react-bootstrap';
import { connect } from 'react-redux';
import Card from '../components/Card';
import ItemTypes from '../constants/ItemTypes';
import { DropTarget } from 'react-dnd';
import { Panel, Popover, Tooltip, Modal, OverlayTrigger, Button } from 'react-bootstrap';
import { DragSource } from 'react-dnd';


@connect(mapStateToProps)
@DropTarget(ItemTypes.CARD, listTarget, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))

export default class Popup extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    connectDropTarget: PropTypes.func.isRequired,

  }

  render() {
    const { title, cards } = this.props;
    const { connectDropTarget } = this.props;

    return connectDropTarget(
      <div className="kanban-list">
        <Panel header={title}>
          {cards.map((card) =>
            <Card {...card} />
          )}
        </Panel>
      </div>
    );
  }
}
