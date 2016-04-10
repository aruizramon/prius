import React, { Component, PropTypes } from 'react'
import { Panel } from 'react-bootstrap'
import ItemTypes from '../ItemTypes'
import { DragSource } from 'react-dnd'

const cardSource = {
  beginDrag(props) {
    title: props.title
    description: props.description
  }
};

@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging()
}))
export default class Card extends Component {
  render() {
    const { title, description, connectDragSource, isDragging } = this.props

    return connectDragSource(
      <Panel bsStyle="primary" header={title}>
        {description}
      </Panel>
    );
  }
}

Card.propTypes = {
  title: PropTypes.string.isRequired,
  description: PropTypes.string,
  connectDragSource: PropTypes.func.isRequired,
  isDragging: PropTypes.bool.isRequired
}
