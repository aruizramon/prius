import React, { Component, PropTypes } from 'react';
import { Panel, Popover, Tooltip, Modal, OverlayTrigger, Button, Grid, Row, Col } from 'react-bootstrap';
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
    communications: PropTypes.array,
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
    console.log(this.props)
    this.setState({ showModal: true });
  }
  log_call() {
      this.setState({ showModal: false });
      var card = this
      var lead_prompt_info = [
        {label: "Contact", fieldtype: "Data", default:this.props.doc.lead_name, read_only: "1"},
        {fieldtype: "Column Break"},
        {label: "Phone", fieldname: "phone_no", fieldtype: "Data", default: this.props.doc.phone, read_only: "1"},
        {fieldtype: "Section Break"},
        {label: "Sent or Received", fieldname: "sent_or_received",
        fieldtype: "Select", options: ["Sent", "Received"], default: "Sent"},
        {fieldtype: "Column Break"},
        {label: "Next Contact Date", fieldtype: "Date", reqd: "1"},
        {fieldtype: "Section Break"},
        {label: "Subject", fieldtype: "Data", default: "Call " + (new Date())},
        {fieldtype: "Section Break"},
        {label: "Notes", fieldname: "content", fieldtype: "Small Text", reqd:"1"}
      ]
      frappe.call({
        method: "frappe.client.get_list",
        args: {
          "doctype": "Communication",
          "fields": ["Subject", "Content", "Communication_Date", "Communication_Type"],
          "filters": {
            "reference_doctype": card.props.doc.doctype,
            "reference_name": card.props.doc.name,
            "communication_type": ["in", ["Comment", "Communication"]]
          }
        },
        callback: function(r) {
          lead_prompt_info.push({fieldtype: "Section Break"})
          var newMessage = "new"
          if(r.message != undefined) {
            r.message.forEach(function(foo) {
              var content = ""
              if(foo.Communication_Type == "Comment") {
                if(foo.Content != null && foo.Subject != null && foo.Content < foo.Subject) {
                  content = foo.Subject + '\n' + foo.Content
                } else if(foo.Content != null) {
                  content = foo.Content
                } else if (foo.Subject != null) {
                  content = foo.Subject
                }
                newMessage = {label: "<i class='octicon octicon-comment-discussion icon-fixed-width'></i> Comment - " + foo.Communication_Date, fieldname: "message",
                              fieldtype: "Small Text", default: content, read_only: "1"}
              } else if (foo.Communication_Type == "Communication") {
                content = foo.Subject + '\n' + foo.Content
                newMessage = {label: "<i class='octicon octicon-device-mobile icon-fixed-width'></i> Communication", fieldname: "message",
                              fieldtype: "Small Text", default: content, read_only: "1"}
              }
              var state = true
              lead_prompt_info.forEach(function(bar) {
                if(JSON.stringify(bar) == JSON.stringify(newMessage)) {
                  state = false
                }
              })
              if(state) {
                lead_prompt_info.push(newMessage)
                lead_prompt_info.push({fieldtype: "Section Break"})
              }
            })
          }
          var communication = frappe.prompt(lead_prompt_info,
            function(data){
              data.doctype = "Communication";
              data.reference_doctype = card.props.doc.doctype;
              data.reference_name = card.props.doc.name;
              card.props.doc.contact_date = data.next_contact_date;
              frappe.call({
                method: "frappe.client.insert",
                args: {
                  "doc": data
                }
              })
            })
        }
      })
  }
  closeApp() {
    this.setState({ showModal: false});
    window.location.reload();
  }
  get_form(form) {
    return { __html: form.form}
  }
  get_comms() {
    var embedCode = this.props.url;
    var cardID = ".modal-body[id*='" + String(embedCode) + "'] #comms";
    for (var i = 0; i < this.props.communications.length; i++) {
      var created = "<strong>Created : </strong>" + String(this.props.communications[i]["creation"]) + "<br>"
      var content = "<strong>Content : </strong>" + String(this.props.communications[i]["content"]) + "<br>"
      var user = "<strong>User : </strong>" + String(this.props.communications[i]["user"]) + "<br>"
      var newComm = "<p>" + created + user + content + "</p>"
      if((i+1) != this.props.communications.length) {
        newComm = newComm + "<hr>";
      }
      $(".modal-content").find(cardID).append(newComm);
    }
  }
  constructor(props) {
    super(props);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.closeApp = this.closeApp.bind(this);
    this.get_form = this.get_form.bind(this);
    this.state = {
      showModal: false,
    }
    this.log_call = this.log_call.bind(this);
    this.get_comms = this.get_comms.bind(this);
  }

  render() {
    const { title, doc, url, descr_1, descr_2, form, communications } = this.props;
    const { connectDragSource, isDragging } = this.props;
    const { showModal } = this.state;

    return connectDragSource(
      <div className="kanban-card">
        <Panel bsStyle="primary"
               header={title}
               onClick={this.open}>
            <small>
              {descr_1.label}: {descr_1.value}
              <br />{descr_2.label}: {descr_2.value}
            </small>
        </Panel>
          <Modal show={this.state.showModal} onEnter={this.get_comms} onHide={this.close}>
            <Modal.Header>
              <Modal.Title>
                <h3>
                <Row>
                  <Col sm={10}>
                      <a href={url} onClick={this.closeApp}>
                        {doc.doctype} - {title} - {doc.name}
                      </a>
                  </Col>
                  <Col sm={2}>
                    <Button onClick={this.log_call}>Log Call</Button>
                  </Col>
                </Row>
              </h3>
              </Modal.Title>
            </Modal.Header>
            <Modal.Body id={url}>
              <Modal.Title><strong>Lead Information</strong></Modal.Title>
              <div id="info">
                <p>
                  <strong>Title : </strong>{title}<br />
                  <strong>{descr_1.label} : </strong>{descr_1.value}<br />
                </p>
              </div>
            </Modal.Body>
            <hr></hr>
            <Modal.Body id={url}>
              <Modal.Title><strong>Communication History</strong></Modal.Title>
              <div id="comms">
              </div>
            </Modal.Body>
            <Modal.Footer>
            </Modal.Footer>
          </Modal>
        </div>
      );
  }
}

export default Card;
