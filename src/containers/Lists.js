import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Row, Col } from 'react-bootstrap';
import List from '../components/List';

const mapStateToProps = (state) => {
  return {
    lists: state.lists,
  };
};

@connect(mapStateToProps)
export default class Lists extends Component {
  render() {
    const { lists } = this.props;
    const rowStyles = {
      overflowX: 'scroll',
      overflowY: 'hidden',
      whiteSpace: 'nowrap',
    };
    const columnStyles = {
      float: 'none',
      display:'inline-block',
      whiteSpace: 'normal',
      verticalAlign: 'top',
      //width: '300px',
    };
    return (
      <Row style={rowStyles}>
        {lists.map((list) =>
          <Col style={columnStyles} sm={6} md={2}>
            <List {...list} />
          </Col>
        )}
      </Row>
    );
  }
}
