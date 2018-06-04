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
    };

    this.toggle = this.toggle.bind(this);
    this.toggleForm = this.toggleForm.bind(this);
    this.onChildClick = this.onChildClick.bind(this);
    this.addAlarm = this.addAlarm.bind(this);
    this.editAlarm = this.editAlarm.bind(this);
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

  addAlarm() {
    this.setState({
      modalData: {},
      modalForm: true,
    });
  }

  editAlarm() {
    this.toggle();
    this.toggleForm();
  }

  onChildClick(key, props) {
    console.log(key);
    console.log(props);
    this.setState({
      modalData: props.data
    }, this.toggle());
  }

  componentDidMount() {
    axios.get('http://localhost:8080/alarm')
    .then(({data}) => {
      if (data.success) {
        this.setState({
          alarms: data.result
        });
      }
    })
    .catch((err) => {
      alert('Cannot connect to url');
    })
  }

  render() {
    const alarms = this.state.alarms;
    const keys = {
      'idEsp': 'ID', 
      'region': 'Region', 
      'latitude': 'Latitude', 
      'longitude': 'Longitude', 
      'connected': 'Connected', 
      'powerOn': 'Power ON', 
      'alarmOn': 'Alarm ON'
    };
    return (
      <div>
        <NavBarCustom/>
        <div className="container pb-3 pt-5">
          <h2 className="mb-3" >Dashboard EWS</h2>
          <Button onClick={this.addAlarm}>Add New Alarm</Button>
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
          <Modal id="modal" isOpen={this.state.modal} toggle={this.toggle} >
            <ModalHeader toggle={this.toggle}>Alarm Detail</ModalHeader>
            <ModalBody>
              {this.state.modalData && 
                Object.keys(keys).map((key) => 
                  <Row>
                    <Col className="col-6 col-md-3">{keys[key]}</Col>
                    <Col> : {typeof(this.state.modalData[key]) === 'boolean' ? this.state.modalData[key].toString() : this.state.modalData[key]}</Col>
                  </Row>)
              }
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.editAlarm} >Edit</Button>{'  '}
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
          <Modal id="modalForm" isOpen={this.state.modalForm} toggle={this.toggleForm} >
            <ModalHeader toggle={this.toggleForm}>Add Alarm</ModalHeader>
            <ModalBody>
              {this.state.modalData && 
                Object.keys(keys).map((key) => 
                  <Row>
                    <Col className="col-6 col-md-3">{keys[key]}</Col>
                    <Col> : <Input id={key} name={key} type="text" placeholder={this.state.modalData && this.state.modalData[key]}/></Col>
                  </Row>)
              }
            </ModalBody>
            <ModalFooter>
              <Button color="primary" onClick={this.toggleForm}>Submit</Button>{'  '}
              <Button color="secondary" onClick={this.toggleForm}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Dashboard;