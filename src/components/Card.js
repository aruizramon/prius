import React, { Component, PropTypes } from 'react';
import { Panel } from 'react-bootstrap';
import ItemTypes from '../constants/ItemTypes';
import { DragSource } from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    const { id, parentList } = props;
    return { id, parentList };
  },
};

@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Card extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    description: PropTypes.string,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
  };

  render() {
    const { title, description } = this.props;
    const { connectDragSource, isDragging } = this.props;

    return connectDragSource(
      <div className="kanban-card">
        <Panel bsStyle="primary" header={title}>
          {description}
        </Panel>
      </div>
    );
  }
}
