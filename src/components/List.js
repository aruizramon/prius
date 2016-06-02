import React, { Component, PropTypes } from 'react';
import { Panel, ListGroup } from 'react-bootstrap';
import { connect } from 'react-redux';
import Card from '../components/Card';
import ItemTypes from '../constants/ItemTypes';
import { DropTarget } from 'react-dnd';

const listTarget = {
  drop(props, monitor, component) {
    const card = monitor.getItem();
    console.log(card);
    console.log(component);
  },
};

const mapStateToProps = (state, props) => {
  var cards = state.cards.filter((card) =>
      card.parentList === props.id &&
      card.doc.source === "List"
    )
  return {
    cards: cards
  };
};

@connect(mapStateToProps)
@DropTarget(ItemTypes.CARD, listTarget, (connect) => ({
  connectDropTarget: connect.dropTarget(),
}))

export default class List extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    length: PropTypes.string,
    description: PropTypes.object,
  }

  render() {
    const { title, description, cards } = this.props;
    const { connectDropTarget } = this.props;

    return connectDropTarget(
      <div className="kanban-list">
        <Panel header={
          <div>
            <h4>
              {title}
              <small>
                <br />{description.label} - {description.value}
                <br />{cards.length} entries in list
              </small>
            </h4>
          </div>
          }>
          <ListGroup>
            {cards.map((card) =>
              <Card {...card} />
            )}
          </ListGroup>
        </Panel>
      </div>
    );
  }
}
