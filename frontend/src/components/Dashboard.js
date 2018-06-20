import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import NavBarCustom from './NavbarCustom'
import axios from 'axios';
import { 
  Modal, ModalBody, ModalHeader, ModalFooter, Button,
  Col, Row, Container, 
  Form, Input, FormGroup, Label
 } from 'reactstrap';
 import ModalCustom from './ModalCustom';

const Marker = ({status}) => 
  <div className={`icon-marker ` + status}>
    <i className="fa fa-bullhorn"/>
  </div>;

class Dashboard extends Component {
  static defaultProps = {
    center: {
      lat: -6.9175,
      lng: 107.6191
    },
    zoom: 7,
  };

  constructor(props) {
    super(props);
    this.state = {
      alarms: [],
      modal: false,
      modalData: {},
      modalForm: false,
      modalType: '',
      region: ''
    };

    this.toggle = this.toggle.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.onChildClick = this.onChildClick.bind(this);
    this.addAlarm = this.addAlarm.bind(this);
    this.editAlarm = this.editAlarm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getAlarms = this.getAlarms.bind(this);
    this.handleFilter = this.handleFilter.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleForm() {
    this.setState({
      modalForm: !this.state.modalForm
    });
  }

  handleInputChange(e) {
    let target = e.target;
    let modalData = this.state.modalData;
    
    modalData[target.name] = target.value;

    this.setState({
      modalData
    });
  }

  handleSubmit() {
    const formKeys = [ 'idEsp', 'region', 'latitude', 'longitude', 'connection', 'power', 'alarmState' ];
    const alarmData = Object.keys(this.state.modalData)
    .filter(key => formKeys.includes(key))
    .reduce((obj, key) => {
      obj[key] = this.state.modalData[key];
      return obj;
    }, {});
    if (this.state.modalType === 'add') {
      axios.post('http://localhost:8080/alarm', alarmData)
      .then(({data}) => {
        if (data.success) {
          this.getAlarms();
          this.toggleForm();
        }
        else {
          alert(data.message);
        }
      })
      .catch((err) => {
        alert('Cannot connect to url');
      });
    }
    else if (this.state.modalType === 'edit') {
      axios.put(`http://localhost:8080/alarm/` + this.state.modalData._id, alarmData)
      .then(({data}) => {
        if (data.success) {
          this.getAlarms();
          this.toggleForm();
        }
        else {
          alert(data.message);
        }
      })
      .catch((err) => {
        alert('Cannot connect to url');
      });
    } 
  }

  handleFilter(e) {
    e.preventDefault();
    if (this.state.region) {
      let query = '?region=' + this.state.region;
      this.getAlarms(query);
    }
    else {
      this.getAlarms();
    }    
  }

  addAlarm() {
    this.setState({
      modalData: {
        'idEsp': '', 
        'region': '', 
        'latitude': 0, 
        'longitude': 0, 
        'connection': 'OFF', 
        'power': 'OFF', 
        'alarmState': 0
      },
      modalForm: true,
      modalType: 'add',
    });
  }

  editAlarm() {
    this.toggle();
    this.setState({
      modalForm: true,
      modalType: 'edit',
    });
  }

  onChildClick(key, props) {
    this.setState({
      modal: true,
      modalType: 'view',
      modalData: props.data
    });
  }

  getAlarms(query = '') {
    axios.get(`http://localhost:8080/alarm` + query)
    .then(({data}) => {
      if (data.success) {
        this.setState({
          alarms: data.result
        });
      }
      else {
        alert(data.message);
      }
    })
    .catch((err) => {
      alert('Cannot connect to url');
    });
  }

  componentDidMount() {
    this.getAlarms();
  }

  render() {
    const alarms = this.state.alarms;
    const keys = {
      'idEsp': 'ESP8266 ID', 
      'region': 'Region', 
      'latitude': 'Latitude', 
      'longitude': 'Longitude', 
      'connection': 'Connection', 
      'power': 'Power', 
      'alarmState': 'Alarm'
    };
    const regions = [ 'JKT', 'BDG' ];
    return (
      <div>
        <NavBarCustom/>
        <div className="container pb-3 pt-5 text-center">
          <h2 className="mb-3" >Dashboard EWS</h2>
          <Form onSubmit={this.handleFilter}>
            <FormGroup>
              <Row className="justify-content-center">
                {/* <Col className="col-auto align-middle"><Label>Region : </Label></Col> */}
                <Col className="col-auto">
                  <Input id="regionFilter" name="region" type="select" value={this.state.region} onChange={(e) => {this.setState({region: e.target.value})}}>
                    <option selected value={''}>Show All</option>
                    {regions.map((value, key) => <option key={key} value={value}>{value}</option>)}
                  </Input>
                </Col>
                <Col className="col-auto">
                  <Button color="secondary" type="submit">Refresh</Button>
                </Col>
              </Row>
            </FormGroup>
          </Form>
          <div style={{ height: '70vh', width: '100%' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: 'AIzaSyCWYIyET_3qS6mHYbqLWCPWicrgtxhPacM' }}
              defaultCenter={this.props.center}
              defaultZoom={this.props.zoom}
              onChildClick={this.onChildClick}
            >
              {alarms.map((alarm) => 
                { 
                  let alarmStatus = 'status-disconnect';
                  if (alarm.alarmState != 0) 
                    alarmStatus = 'status-alarm-on';
                  else if (alarm.power === 'ON') 
                    alarmStatus = 'status-power-on';
                  else if (alarm.connection === 'ON') 
                    alarmStatus = 'status-power-off';
                  return(
                    <div key={alarm._id} data={alarm} lat={alarm.latitude} lng={alarm.longitude}>
                      <Marker status={alarmStatus}/>
                    </div>
                  );
                }
              )}
            </GoogleMapReact>
          </div>
          <Button onClick={this.addAlarm}  color="primary" className="float-right my-3">Add New Alarm</Button>
          <Modal id="modal" isOpen={this.state.modal} toggle={this.toggle} >
            <ModalHeader toggle={this.toggle}>Alarm Detail</ModalHeader>
            <ModalBody>
              {this.state.modalData && 
                Object.keys(keys).map((key) => 
                  <Row>
                    <Col className="col-6 col-md-3">{keys[key]}</Col>
                    <Col> : {this.state.modalData[key]}</Col>
                  </Row>)
              }
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.editAlarm} >Edit</Button>{'  '}
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
          <Modal id="modalForm" isOpen={this.state.modalForm} toggle={this.toggleForm} >
            <ModalHeader toggle={this.toggleForm}>{this.state.modalType === 'add' ? 'Add Alarm' : 'Edit Alarm'}</ModalHeader>
            <ModalBody>
              {this.state.modalData && 
                Object.keys(keys).map((key) => 
                  <Row>
                    <Col className="col-6 col-md-3 vcenter">{keys[key]}</Col>
                    <Col className="col-6 col-md-9 vcenter">{ key === 'connection' || key === 'power' || key === 'alarmState'
                        ?
                        <div className="">{this.state.modalData[key]}</div>
                        :
                        <Input id={key} name={key} type="text" value={this.state.modalData[key]} onChange={this.handleInputChange}/>
                      }
                    </Col>
                  </Row>)
              }
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.handleSubmit}>Submit</Button>{'  '}
              <Button color="secondary" onClick={this.toggleForm}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Dashboard;