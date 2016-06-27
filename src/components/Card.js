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
  //// log_call()
  // calls frappe.prompt to log a call for the given lead
  log_call() {
      this.setState({ showModal: false });
      var card = this
      var prompt_info = []
      if (this.props.doc.contact_date === undefined) {
        prompt_info = [
          {label: "Contact", fieldtype: "Data", default:this.props.doc.lead_name, read_only: "1"},
          {fieldtype: "Column Break"},
          {label: "Phone", fieldname: "phone_no", fieldtype: "Data", default: this.props.doc.phone, read_only: "1"},
          {fieldtype: "Section Break"},
          {label: "Sent or Received", fieldname: "sent_or_received",
          fieldtype: "Select", options: ["Sent", "Received"], default: "Sent"},
          {fieldtype: "Section Break"},
          {label: "Subject", fieldtype: "Data", default: "Call " + (new Date())},
          {fieldtype: "Section Break"},
          {label: "Notes", fieldname: "content", fieldtype: "Small Text", reqd:"1"}
        ]
      }
      else {
        prompt_info = [
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
      }
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
          prompt_info.push({fieldtype: "Section Break"})
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
              prompt_info.forEach(function(bar) {
                if(JSON.stringify(bar) == JSON.stringify(newMessage)) {
                  state = false
                }
              })
              if(state) {
                prompt_info.push(newMessage)
                prompt_info.push({fieldtype: "Section Break"})
              }
            })
          }
          var communication = frappe.prompt(prompt_info,
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
                  if (card.props.doc.contact_date !== undefined) {
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
  //// addValue()
  // adds the field info and the communication history to a card onEnter event
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
  //// makeField()
  // returns a html formatted form-group with the given label and field
  makeField(field, label) {
    if (field == null) {
      var field_html = ('<div class="form-group has-error" style="padding-left:15px;"><label class="control-label">'
        + label
        + '</label><br />'
        + "<strong>No Information</strong>"
        + '</div><br />')
    } else if (this.getStyle(this.props.doc, this.props.display) == "pastDueCall" && label == "Next Contact Date") {
      var field_html = ('<div class="form-group has-error" style="padding-left:15px;"><label class="control-label">'
        + label
        + '</label><br />'
        + "<strong>" + field + "</strong>"
        + '</div><br />')
    } else {
        var field_html = ('<div class="form-group" style="padding-left:15px;"><label class="control-label">'
          + label
          + '</label><br />'
          + field
          + '</div><br />')
    }
    return field_html
  }
  //// getInfo()
  // returns the html formatted lead info
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
      + '</p></div>'
    var col2 = '<div class="col-sm-6"><p>'
      + subtitleTwo + fieldThree + fieldFour
      + '</p></div>'
    return('<div class="row">' + col1 + col2 + '</div><br />')
  }
  //// commMakeFOrm(label, value)
  // returns an html formatted communication for the history
  commMakeForm(label, value) {
    var form = ''
    var oticon = {}
    oticon["Comment"] = "<i class='octicon octicon-comment-discussion icon-fixed-width'></i> ";
    oticon["Communication"] = "<i class='octicon octicon-device-mobile icon-fixed-width'></i> ";
    oticon["Status Update"] = "<i class='octicon octicon-pencil icon-fixed-width'></i> ";
    if (label == "Comment" || label == "Communication" || label == "Status Update") {
      form = "<p style='max-width:600px; background-color:#ebeff2; margin-bottom:0px;"
                + " padding-left:15px; padding-top:7px; padding-bottom:7px;'>"
                + "<span>" + oticon[label] + label + ": " + value + "</span></p>"
    } else if (label == "Col") {
      form = '<div class="col-sm-6"><p>'
                + value
                + '</p></div>'
    } else {
      form = '<div class="form-group"><label class="control-label">'
                + label
                + '</label><br />'
                + value
                + '</div>'
    }
    return form
  }
  //// getComms()
  // returns the html formatted lead communication history
  getComms() {
    var comm = "<div class='panel panel-default' style='margin:-15px;'>"
      + "<div class='panel-heading' data-toggle='collapse' href='#collapse1'>"
      + "Communication History"
      + "<i class='octicon octicon-chevron-down icon-fixed-width' style='float:right;'></i>"
      + "</div><div id='collapse1' class='panel-collapse collapse'>"
    for (var i = 0; i < this.props.doc.communications.length; i++) {
      var type = this.props.doc.communications[i]["communication_type"]
      var date = this.formatField('Date', this.props.doc.communications[i]["communication_date"])
      if (type == "Comment") {
        if (this.props.doc.communications[i]["comment_type"] == "Updated") {
          type = "Status Update"
        }
      }
      var commType = this.commMakeForm(type, date)
      var subject = this.commMakeForm('Subject', String(this.props.doc.communications[i]["subject"]))
      var user = this.commMakeForm('User', String(this.props.doc.communications[i]["user"]))
      var content = ''
      // if content is empty, dont render field
      if (this.props.doc.communications[i]["content"] != null) {
        content = this.commMakeForm('Content', String(this.props.doc.communications[i]["content"]))
      }

      var col1 = this.commMakeForm('Col', subject)
      var col2 = this.commMakeForm('Col', user)
      var row1 = '<div class="row" style="margin-top:5px; margin-left:3px; margin-right:17px; border-right:2px; border-color:#ebeff2;">'
                  + col1 + col2 + '</div>'
      var row2 = '<div class="row" style="margin-top:-15px; margin-left:3px; margin-right:17px; border-right:2px; border-color:#ebeff2;">'
                  + '<div class="col-sm-12"><p>' + content + '</p></div></div>'
      var newComm = "<div class='row'>"
                     + "<div class='col-sm-12'><p>"
                     + commType + "<div style='margin-left:14px; margin-top:0px; border-style: solid; border-width: 0px 0px 0px 3px; border-color:#ebeff2;'>"
                     + row1 + row2 +"</div></p></div></div>"
      comm = comm + newComm
    }
    comm = comm + "</div></div>"
    return comm
  }
  //// formatField(fieldtype, field)
  // formats and returns given field based on type
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
  //// checkStale(doc, display)
  // returns false if
  // - last communication is < 30 days ago
  // - next contact date is < 30 days ago
  // otherwise the lead is stale and returns true
  checkStale(doc, display) {
    var now = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD")
    var contactDate = moment(doc.contact_date, "YYYY-MM-DD");
    var staleDate = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD").subtract(30, 'days');
    var state = true;

    if (staleDate.isBefore(contactDate)) {
      state = false;
    } else {
      state = this.checkCommunications(doc, display);
    }
    return state
  }
  //// checkCommunications(doc, display)
  // checks the dates of the communication history
  // returns true if stale and false if within 30 days
  checkCommunications(doc, display) {
    var state = true;
    var staleDate = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD").subtract(30, 'days');
    for (var i = 0; i < doc.communications.length; i++) {
      var type1 = doc.communications[i]["communication_type"];
      var type2 = doc.communications[i]["comment_type"];
      if (type1 == "Communication" || type2 != "Updated") {
        var newDate = moment(doc.communications[i]["communication_date"], "YYYY-MM-DD");
        if (staleDate.isBefore(newDate)) {
          state = false;
        }
      }
    }
    return state
  }
  //// getStyle(doc, display)
  // validates and returns the state of the lead
  getStyle(doc, display) {
    // if a card field is null, danger
    for (var prop in display) {
      if (display.hasOwnProperty(prop)) {
        if (display[prop] == null) {
          return "missingData"
        }
      }
    }
    var now = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD");
    var contact = moment(doc.contact_date, "YYYY-MM-DD");
    var nextWeek = moment(moment().format("YYYY-MM-DD"), "YYYY-MM-DD").add(7, 'days');
    var staleDate = this.checkStale(doc, display);
    // if a card has a nextContactBy or last communication
    // date > 30 days less than the current
    if (staleDate) {
      return "stale"
    }
    // if a card has a nextContactBy within the next week
    else if (now.isSameOrBefore(contact) && contact.isSameOrBefore(nextWeek)) {
      return "imminentContact"
    }
    // if a card has a nextContactBy already passed due but is not stale
    else if (now.isAfter(contact)){
      return "pastDueCall"
    }
    // all info is correct and no dates are due/past
    return "statusOK"
  }
  constructor(props, context) {
    super(props, context);
    this.open = this.open.bind(this);
    this.close = this.close.bind(this);
    this.closeApp = this.closeApp.bind(this);
    this.getForm = this.getForm.bind(this);
    this.formatField = this.formatField.bind(this);
    this.getStyle = this.getStyle.bind(this);
    this.checkStale = this.checkStale.bind(this);
    this.state = {
      showModal: false,
    }
    this.log_call = this.log_call.bind(this);
    this.addValue = this.addValue.bind(this);
    this.getInfo = this.getInfo.bind(this);
    this.getComms = this.getComms.bind(this);
    this.commMakeForm = this.commMakeForm.bind(this);
    this.checkCommunications = this.checkCommunications.bind(this);
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

        <Modal bsStyle={this.getStyle(doc, display)} show={this.state.showModal} onEnter={this.addValue} onHide={this.close}>
          <Modal.Header>
            <Modal.Title>
              <Row>
                <Col sm={9} md={9} lg={9}>
                    <a href={url} target={url}>{this.formatField(display.titleFieldType, display.titleField)}</a>
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
