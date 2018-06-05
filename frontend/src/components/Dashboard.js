import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import NavBarCustom from './NavbarCustom'
import axios from 'axios';
import { 
  Modal, ModalBody, ModalHeader, ModalFooter, Button,
  Col, Row, Container, 
  Form, Input,
 } from 'reactstrap';
 import ModalCustom from './ModalCustom';

const markerStyle = {
  height: '40px', 
  width: '40px',
  position: 'absolute',
  left: '-20px',
  top: '-20px',
};
const Marker = () => <div><img style={markerStyle} src="http://www.wfgnj.com/wp-content/uploads/2014/07/bullhorn-1024x1024.png" /></div>;

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
    };

    this.toggle = this.toggle.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.onChildClick = this.onChildClick.bind(this);
    this.addAlarm = this.addAlarm.bind(this);
    this.editAlarm = this.editAlarm.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.getAlarms = this.getAlarms.bind(this);
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
    console.log(alarmData)
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

  addAlarm() {
    this.setState({
      modalData: {
        'idEsp': '', 
        'region': '', 
        'latitude': 0, 
        'longitude': 0, 
        'connection': 'OFF', 
        'power': 'OFF', 
        'alarmState': 'OFF'
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

  getAlarms() {
    axios.get('http://localhost:8080/alarm')
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
    return (
      <div>
        <NavBarCustom/>
        <div className="container pb-3 pt-5">
          <h2 className="mb-3" >Dashboard EWS</h2>
          <div style={{ height: '70vh', width: '100%' }}>
            <GoogleMapReact
              bootstrapURLKeys={{ key: 'AIzaSyCWYIyET_3qS6mHYbqLWCPWicrgtxhPacM' }}
              defaultCenter={this.props.center}
              defaultZoom={this.props.zoom}
              onChildClick={this.onChildClick}
            >
              {alarms.map((alarm) => 
                { 
                  return(
                    <div key={alarm._id} data={alarm} lat={alarm.latitude} lng={alarm.longitude}>
                      <Marker />
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
                    <Col className="col-6 col-md-3">{keys[key]}</Col>
                    <Col className="col-6 col-md-9">{ key === 'connection' || key === 'power' || key === 'alarmState'
                        ?
                        <Input id={key} name={key} type="select" value={this.state.modalData[key]} onChange={this.handleInputChange}>
                          <option value={'ON'}>ON</option>
                          <option value={'OFF'} selected>OFF</option>
                        </Input>
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