import React, { Component, PropTypes } from 'react'
import { Modal, Input, ButtonInput, Button } from 'react-bootstrap';

export default class Form extends Component {
  render() {
    return (
      <Modal keyboard>
        <Modal.Header closeButton>
          <Modal.Title>Modal heading</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Input type="text" label="Name" />
          <Input type="textarea" label="Description" />
        </Modal.Body>
        <Modal.Footer>
          <ButtonInput type="submit" value="Add to Backlog" bsStyle="primary" />
        </Modal.Footer>
      </Modal>
    )
  }
}
