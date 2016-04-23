import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import List from '../components/List';

const mapStateToProps = (state) => {
  return {
    lists: state.lists,
    cards: state.cards,
  };
};

@connect(mapStateToProps)
export default class Lists extends Component {
  render() {
    const { lists, cards } = this.props;
    return (
      <Row>
        {lists.map((list) =>
          <Col sm={6} md={3}>
            <List {...list} cards={cards} />
          </Col>
        )}
      </Row>
    );
  }
}
