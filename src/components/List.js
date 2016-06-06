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

const checkFilterMatch = (filterValues, docValue) => {
  var match = false;
  filterValues.forEach(function(value) {
    if (value.value == docValue) {
      match = true;
    }
  });
  return match;
}

const isHidden = (doc, filters) => {
  var hidden = false;
  filters.forEach(function(filter) {
    if (filter.values.length > 0) {
      if (!checkFilterMatch(filter.values, doc[filter.id])){
        hidden = true;
      }
    }
  });
  return hidden;
}

const mapStateToProps = (state, props) => {
  var cards = state.cards.filter((card) =>
      card.parentList === props.id &&
      isHidden(card.doc, state.filters) == false
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
    description: PropTypes.object
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
                <br />{cards.length} in list
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
