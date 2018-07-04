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
 import _ from 'lodash';

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
      region: 'All',
      alarmType: 1,
      allregions: [],
      alarmform: false,
    };

    // this.toggle = this.toggle.bind(this);
    // this.toggleForm = this.toggleForm.bind(this);
    // this.onChildClick = this.onChildClick.bind(this);
    // this.addAlarm = this.addAlarm.bind(this);
    // this.editAlarm = this.editAlarm.bind(this);
    // this.handleInputChange = this.handleInputChange.bind(this);
    // this.handleSubmit = this.handleSubmit.bind(this);
    // this.getAlarms = this.getAlarms.bind(this);
    // this.handleFilter = this.handleFilter.bind(this);
  }

  componentDidMount() {
    this.getAlarms();
  }

  toggle = () => {
    this.setState({
      modal: !this.state.modal
    });
  }

  toggleForm = () => {
    this.setState({
      modalForm: !this.state.modalForm
    });
  }

  handleInputChange = (e) => {
    let target = e.target;
    let modalData = this.state.modalData;
    
    modalData[target.name] = target.value;

    this.setState({
      modalData
    });
  }

  handleSubmit = () => {
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

  handleFilter = (e) => {
    if (this.state.region !== 'All') {
      let query = '?region=' + this.state.region;
      this.getAlarms(query);
    }
    else {
      this.getAlarms();
    }    
  }

  addAlarm = () => {
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

  editAlarm = () => {
    this.toggle();
    this.setState({
      modalForm: true,
      modalType: 'edit',
    });
  }

  onChildClick = (key, props) => {
    this.setState({
      modal: true,
      modalType: 'view',
      modalData: props.data
    });
  }

  getAlarms = (query = '') => {
    axios.get(`http://localhost:8080/alarm` + query)
    .then(({data}) => {
      if (data.success) {
        this.setState({
          alarms: data.result
        });
        if (query === '') {
          let allregions = data.result.map(alarm => alarm.region);
          allregions = _.uniq(allregions);
          this.setState({
            allregions
          });
        } 
      }
      else {
        alert(data.message);
      }
    })
    .catch((err) => {
      alert('Cannot connect to url');
    });
  }

  handleWarning = (e) => {
    e.preventDefault();
    
    const topic = 'alarm/' + (this.state.region === 'All' ? '#' : this.state.region);
    const data = {
      alarmType: this.state.alarmType
    }
    console.log(topic);
    console.log(data);
    const body = {
      topic,
      data
    }

    axios.post('http://localhost:8080/send-mqtt', body)
    .then(({data}) => {
      this.setState({alarmform: false});
      alert(data.message);
    })
    .catch((err) => {
      alert('Cannot connect to url');
    });
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
      'alarmState': 'Alarm State'
    };
    return (
      <div>
        <NavBarCustom/>
        <Container className="pb-3 pt-5 text-center">

          <Row>
          
          <Col xs="12" md="3" >
            <h2 className="mb-3" >Dashboard EWS</h2>
            <hr/>
            <Row>
              <Col>
              {
                !this.state.alarmform ?
                  <Button id="BtnWarning" onClick={() => {this.setState({alarmform: true});}} color="danger" className="p-3">
                    <i className="fa fa-exclamation-triangle fa-lg fa-3x mb-3"/>
                    <h3>WARNING</h3>
                  </Button>
                :
                  <Form id="AlarmForm" className="form-horizontal text-left" onSubmit={this.handleWarning}>
                    <FormGroup>
                      <Label className="mb-0">Alarm Type</Label>
                      <Input type="select" name="alarmType" value={this.state.alarmType} onChange={(e) => {this.setState({alarmType: e.target.value})}}>
                        <option value={1}>Tsunami</option>
                        <option value={2}>Gunung Meletus</option>
                      </Input>
                    </FormGroup>
                    <FormGroup>
                      <Label className="mb-0">Region</Label>
                      {/* <Input type="select" value={this.state.region}>
                        <option value={''}>All</option>
                        {this.state.allregions.map((value, key) => <option key={key} value={value}>{value}</option>)}
                      </Input> */}
                      <Input name="region" type="select" value={this.state.region} onChange={(e) => {this.setState({region: e.target.value})}}>
                        <option value="All">All</option>
                        {this.state.allregions.map((value, key) => <option key={key} value={value}>{value}</option>)}
                      </Input>
                    </FormGroup>
                    <Button type="submit" color="danger"><span><i className="fa fa-exclamation-circle"/></span> SUBMIT</Button>
                  </Form>
              }
              </Col>
            </Row>
            <hr/>
            <Row>
              <Col >
                <Input id="regionFilter" name="region" type="select" value={this.state.region} onChange={(e) => {this.setState({region: e.target.value})}}>
                  <option value="All">All</option>
                  {this.state.allregions.map((value, key) => <option key={key} value={value}>{value}</option>)}
                </Input>
              </Col>
              <Col xs="auto" >
                <Button color="secondary" onClick={this.handleFilter}>Refresh</Button>
              </Col>
            </Row>
            <hr/>
            <Row>
              <Col>
                <Button onClick={this.addAlarm}  color="primary">Add New Alarm</Button>
              </Col>
            </Row>
          </Col>
           
          <Col xs="12" md="9" style={{ height: '80vh', width: '100%' }}>
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
          </Col>
          </Row>

          <Modal id="modal" isOpen={this.state.modal} toggle={this.toggle} >
            <ModalHeader toggle={this.toggle}>Alarm Detail</ModalHeader>
            <ModalBody>
              {this.state.modalData && 
                Object.keys(keys).map((item, key) => 
                  <Row key={key}>
                    <Col className="col-6 col-md-3">{keys[item]}</Col>
                    <Col> : {this.state.modalData[item]}</Col>
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
                Object.keys(keys).map((item, key) => 
                  <Row key={key}>
                    <Col className="col-6 col-md-3 vcenter">{keys[item]}</Col>
                    <Col className="col-6 col-md-9 vcenter">{ item === 'connection' || item === 'power' || item === 'alarmState'
                        ?
                        <div className="">{this.state.modalData[item]}</div>
                        :
                        <Input id={item} name={item} type="text" value={this.state.modalData[item]} onChange={this.handleInputChange}/>
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
        </Container>
      </div>
    );
  }
}

export default Dashboard;