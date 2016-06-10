import React, { Component, PropTypes } from 'react';
import { Panel, Modal, Button, ButtonToolbar} from 'react-bootstrap';
import { Form, FormGroup, ControlLabel, Row, Col } from 'react-bootstrap';
import ItemTypes from '../constants/ItemTypes';
import { DragSource } from 'react-dnd';
import '../style.css'
var numeral = require('numeral');
var moment = require('moment');

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
    key: PropTypes.string,
    doc: PropTypes.object,
    display: PropTypes.object,
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    showModal: PropTypes.bool.isRequired,
    url: PropTypes.string,
  };
  close() {
    this.setState({ showModal: false });
  }
  open() {
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
              frappe.call({
                method: "frappe.client.insert",
                args: {
                  "doc": data
                },
                callback: function(r) {
                  frappe.call({
                    method: "frappe.client.set_value",
                    args: {
                      "doctype": card.props.doc.doctype,
                      "name": card.props.doc.name,
                      "fieldname": "contact_date",
                      "value": data.next_contact_date
                    }
                  })
                }
              })
            })
          }
        });
  }
  closeApp() {
    this.setState({ showModal: false});
    window.location.reload();
  }
  // unused
  getForm(form) {
    return { __html: form.form}
  }
  addValue() {
    var url = this.props.url;
    var cardID = ".modal-body[id*='" + String(url) + "']";
    var info = this.getInfo();
    $(".modal-content").find(cardID).append(info);
    if (this.props.doc.communications != null){
      var comm = this.getComms();
      $(".modal-content").find(cardID).append(comm);
    }
  }
  // moved html to here from getInfo to make it easier to change styling
  makeField(field, label) {
    return ('<div class="form-group" style="padding-left:15px;"><label class="control-label">'
      + label
      + '</label><br />'
      + field
      + '</div><br />')
  }
  getInfo() {
    var subtitleOne = this.makeField(this.formatField(
        this.props.display.subOneType, this.props.display.subOne),
        this.props.display.subOneLabel)
    var subtitleTwo = this.makeField(this.formatField(
        this.props.display.subTwoType, this.props.display.subTwo),
        this.props.display.subTwoLabel)
    var fieldOne = this.makeField(this.formatField(
        this.props.display.fieldOneType, this.props.display.fieldOne),
        this.props.display.fieldOneLabel)
    var fieldTwo = this.makeField(this.formatField(
        this.props.display.fieldTwoType, this.props.display.fieldTwo),
        this.props.display.fieldTwoLabel)
    var fieldThree = this.makeField(this.formatField(
        this.props.display.fieldThreeType, this.props.display.fieldThree),
        this.props.display.fieldThreeLabel)
    var fieldFour = this.makeField(this.formatField(
        this.props.display.fieldFourType, this.props.display.fieldFour),
        this.props.display.fieldFourLabel)
    var col1 = '<div class="col-sm-6"><p>'
       + subtitleOne + fieldOne + fieldTwo
      + '</div>'
    var col2 = '<div class="col-sm-6"><p>'
      + subtitleTwo + fieldThree + fieldFour
      + '</div>'
    return('<div class="row">' + col1 + col2 + '</div></div><br />')
  }
  getComms() {
    var comm = "<div class='panel panel-default' style='margin:-15px;'>"
      + "<div class='panel-heading' data-toggle='collapse' href='#collapse1'>"
      + "Communication History"
      + "<i class='octicon octicon-chevron-down icon-fixed-width' style='float:right;'></i>"
      + "</div><div id='collapse1' class='panel-collapse collapse'>"
    for (var i = 0; i < this.props.doc.communications.length; i++) {
      var type = this.props.doc.communications[i]["communication_type"]
      var date = this.formatField('Date', this.props.doc.communications[i]["communication_date"])
      if(type == "Comment") {
        var commType = "<span style='padding-left:15px;'><strong>"
                        + "<i class='octicon octicon-comment-discussion icon-fixed-width'></i> "
                        + type + "</strong>: " + date + "</span><br>"
      } else if(type == "Communication") {
        var commType = "<span style='padding-left:15px;'><strong>"
                        + "<i class='octicon octicon-device-mobile icon-fixed-width'></i> "
                        + type + "</strong>: " + date + "</span><br>"
      }
      var subject = "<span style='padding-left:15px;'><strong>Subject : </strong>"
                     + String(this.props.doc.communications[i]["subject"]) + "</span><br>"
      var content = "<span style='padding-left:15px;'><strong>Content : </strong>"
                     + String(this.props.doc.communications[i]["content"]) + "</span><br>"
      var user = "<span style='padding-left:15px;'><strong>User : </strong>"
                  + String(this.props.doc.communications[i]["user"]) + "<br>"
      var newComm = "<div class='row'>"
                     + "<div class='col-sm-12'><p>"
                     + commType
                     + "<pre style='margin-left:15px; margin-right:15px;"
                     + " white-space: pre-wrap; white-space: -moz-pre-wrap;"
                     + " white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;'>"
                     + subject + user + content + "</pre></p></div></div>"
      comm = comm + newComm
    }
    comm = comm + "</div></div><br />"
    return comm
  }
  formatField(fieldtype, field) {
    if (fieldtype == 'Currency') {
      field = numeral(field).format('$0,0')
    } else if (fieldtype == 'Int') {
      field = numeral(field).format('0,0')
    } else if (fieldtype == 'Float') {
      field = numeral(field).format('0,0.00')
    } else if (fieldtype == 'Date' || fieldtype == 'Datetime') {
      if (field != null) {
        field = moment(field).format('dddd, MMM Do, YYYY')
      }
    }
    return field
  }
  getStyle(doc, display) {
    // if a card field is null, danger
    for (var prop in display) {
      if (display.hasOwnProperty(prop)) {
        if (display[prop] == null) {
          return "danger"
        }
      }
    }
    var now = moment();
    var contact = moment(doc.contact_date);
    var nextWeek = now.clone().add(7, 'days');
    if (contact < now) {
      return "warning"
    } else if (now <= contact && contact <= nextWeek){
      return "info"
    }
    return "default"
  }
  constructor(props, context) {
    super(props, context);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.closeApp = this.closeApp.bind(this);
    this.getForm = this.getForm.bind(this);
    this.formatField = this.formatField.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.state = {
      showModal: false,
    }
    this.log_call = this.log_call.bind(this);
    this.addValue = this.addValue.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.getComms = this.getComms.bind(this);
  }

  render() {
    const { doc, url, display, key } = this.props;
    const { connectDragSource, isDragging } = this.props;
    const { showModal } = this.state;

    return (
      <div className="kanban-card" id={key}>
        <Panel bsStyle={this.getStyle(doc, display)}
               header={display.titleField}
               onClick={this.open}>
            <small>
              {display.subOneLabel} - {this.formatField(display.subOneType, display.subOne)}
              <br />
              {display.subTwoLabel} - {this.formatField(display.subTwoType, display.subTwo)}
            </small>
        </Panel>

        <Modal show={this.state.showModal} onEnter={this.addValue} onHide={this.close}>
          <Modal.Header>
            <Modal.Title>
              <Row>
                <Col sm={9} md={9} lg={9}>
                    <a href={url}>{this.formatField(display.titleFieldType, display.titleField)}</a>
                </Col>
                <Col sm={3} md={3} lg={3}>
                  <ButtonToolbar bsClass="btn-toolbar pull-right">
                    <Button bsSize="xsmall" bsStyle="primary" onClick={this.log_call}>Log Call</Button>
                    <Button bsSize="xsmall" onClick={this.close}>&times;</Button>
                  </ButtonToolbar>
                </Col>
              </Row>
            </Modal.Title>
          </Modal.Header>
          <Modal.Body id={url}>
          </Modal.Body>
        </Modal>
      </div>
      );
  }
}

export default Card;
