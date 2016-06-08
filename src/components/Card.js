import React, { Component, PropTypes } from 'react';
import { Panel, Popover, Tooltip, Modal, OverlayTrigger, Button } from 'react-bootstrap';
import { Form, FormGroup, ControlLabel, Row, Col } from 'react-bootstrap';
import ItemTypes from '../constants/ItemTypes';
import { DragSource } from 'react-dnd';
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
  // unused
  getForm(form) {
    return { __html: form.form}
  }
  addValue() {
    var url = this.props.url;
    var cardID = ".modal-body[id*='" + String(url) + "']";
    var info = this.getInfo();
    var comm = this.getComms();
    $(".modal-content").find(cardID).append(info);
    $(".modal-content").find(cardID).append(comm);
  }
  getInfo() {
    var newInfo = "<div class='panel panel-default' style='margin:-15px;'>"
      + "<div class='panel-heading'><h4 class='panel-title'>"
      + "Doccument Information"
      + "</h4></div><div class='panel'>"
    var title = '<div class="form-group" style="padding-left:15px;"><label class="control-label">'
      + this.props.display.titleFieldLabel
      + '</label><p class="form-control-static">'
      + this.formatField(this.props.display.titleFieldType, this.props.display.titleField)
      + '</p></div>'
    var person_name = '<div class="form-group" style="padding-left:15px;"><label class="control-label">'
      + this.props.display.subOneLabel
      + '</label><p class="form-control-static">'
      + this.formatField(this.props.display.subOneType, this.props.display.subOne)
      + '</p></div>'
    var source = '<div class="form-group" style="padding-left:15px;"><label class="control-label">'
      + this.props.display.subTwoLabel
      + '</label><p class="form-control-static">'
      + this.formatField(this.props.display.subTwoType, this.props.display.subTwo)
      + '</p></div>'
    var phone = '<div class="form-group" style="padding-left:15px;"><label class="control-label">'
      + this.props.display.fieldTwoLabel
      + '</label><p class="form-control-static">'
      + this.formatField(this.props.display.fieldTwoType, this.props.display.fieldTwo)
      + '</p></div>'
    var email = '<div class="form-group" style="padding-left:15px;"><label class="control-label">'
      + this.props.display.fieldThreeLabel
      + '</label><p class="form-control-static">'
      + this.formatField(this.props.display.fieldThreeType, this.props.display.fieldThree)
      + '</p></div>'
    var next_date = '<div class="form-group" style="padding-left:15px;"><label class="control-label">'
      + this.props.display.fieldOneLabel
      + '</label><p class="form-control-static">'
      + this.formatField(this.props.display.fieldOneType, this.props.display.fieldOne)
      + '</p></div>'
    var col1 = '<div class="col-sm-6"><p>'
      + title + person_name + source
      + '</div>'
    var col2 = '<div class="col-sm-6"><p>'
      + phone + email + next_date
      + '</div>'
    newInfo = newInfo + '<div class="row">' + col1 + col2 + '</div></div>'
    return newInfo
  }
  getComms() {
    var comm = "<div class='panel panel-default' style='margin:-15px;'>"
      + "<div class='panel-heading' data-toggle='collapse' href='#collapse1'><h4 class='panel-title'>"
      + "Communication History"
      + "<i class='octicon octicon-chevron-down icon-fixed-width' style='float:right;'></i>"
      + "</h4></div><div id='collapse1' class='panel-collapse collapse'>"
    for (var i = 0; i < this.props.doc.communications.length; i++) {
      var type = this.props.doc.communications[i]["communication_type"]
      if(type == "Comment") {
        var date = this.props.doc.communications[i]["communication_date"]
        var commType = "<span style='padding-left:15px;'><strong>"
                        + "<i class='octicon octicon-comment-discussion icon-fixed-width'></i> "
                        + type + "</strong> : " + date + "</span><br>"

      } else if(type == "Communication") {
        var commType = "<span style='padding-left:15px;'><strong>"
                        + "<i class='octicon octicon-device-mobile icon-fixed-width'></i> "
                        + type + "</strong></span><br>"
      }
      var subject = "<span style='padding-left:5px;'><strong>Subject : </strong>"
                     + String(this.props.doc.communications[i]["subject"]) + "</span><br>"
      var content = "<span style='padding-left:5px;'><strong>Content : </strong>"
                     + String(this.props.doc.communications[i]["content"]) + "</span><br>"
      var user = "<span style='padding-left:5px;'><strong>User : </strong>"
                  + String(this.props.doc.communications[i]["user"]) + "<br>"
      var newComm = "<div class='row'>"
                     + "<div class='col-sm-12'><p>"
                     + commType
                     + "<pre style='margin-left:5px; margin-right:5px;"
                     + " white-space: pre-wrap; white-space: -moz-pre-wrap;"
                     + " white-space: -pre-wrap; white-space: -o-pre-wrap; word-wrap: break-word;'>"
                     + subject + user + content + "</pre></p></div></div>"
      comm = comm + newComm
    }
    comm = comm + "</div></div>"
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
  constructor(props) {
    super(props);
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
    const { doc, url, display } = this.props;
    const { connectDragSource, isDragging } = this.props;
    const { showModal } = this.state;

    return (
      <div className="kanban-card">
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
              <h4>
                <Row>
                  <Col sm={8}>
                      <a href={url} onClick={this.closeApp}>
                        {doc.doctype} - {this.formatField(display.titleFieldType, display.titleField)} - {doc.name}
                      </a>
                  </Col>
                  <Col sm={4}>
                    <Button onClick={this.log_call}>Log Call</Button><span> </span>
                    <Button onClick={this.close}>Cancel</Button>
                  </Col>
                </Row>
              </h4>
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
