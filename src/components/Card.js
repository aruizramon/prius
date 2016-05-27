import React, { Component, PropTypes } from 'react';
import { Panel, Popover, Tooltip, Modal, OverlayTrigger, Button } from 'react-bootstrap';
import ItemTypes from '../constants/ItemTypes';
import { DragSource } from 'react-dnd';

const cardSource = {
  beginDrag(props) {
    const { id, parentList } = props;
    return { id, parentList };
  },
};

@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  showModal: false,
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))

class Card extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    descr_1: PropTypes.object,
    descr_2: PropTypes.object,
    doc: PropTypes.object,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    showModal: PropTypes.bool.isRequired,
    url: PropTypes.string,
    form: PropTypes.any,
  };
  close() {
    this.setState({ showModal: false });
  }
  open() {
    this.setState({ showModal: true });
  }
  closeApp() {
    this.setState({ showModal: false});
    window.location.reload();
  }
  get_form(form) {
    return { __html: form.form}
  }
  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.closeApp = this.closeApp.bind(this);
    this.get_form = this.get_form.bind(this);
  }

  render() {
    const { title, doc, url, descr_1, descr_2, form } = this.props;
    const { connectDragSource, isDragging } = this.props;
    const { showModal } = this.state;

    return connectDragSource(
        <div className="kanban-card">
          <Panel bsStyle="primary" header={title} onClick={this.open}>
              <small>
                {descr_1.label}: {descr_1.value}
                <br />{descr_2.label}: {descr_2.value}
              </small>
          </Panel>

          <Modal show={this.state.showModal} onHide={this.close}>
            <Modal.Header>
              <Modal.Title>
                <a href={url} onClick={this.closeApp}>
                  <h3>{doc.doctype} - {title} - {doc.name}</h3>
                </a>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
            <div id="form-popup"
              dangerouslySetInnerHTML={this.get_form({form})}>
            </div>
            </Modal.Body>
            <Modal.Footer>
              <Button onClick={this.close}>Close</Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
  }
}

export default Card;
