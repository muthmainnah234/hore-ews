import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import NavBarCustom from './NavbarCustom'
import axios from 'axios';
import { 
  Modal, ModalBody, ModalHeader, ModalFooter, Button,
  Col, Row, Container,
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
    };

    this.toggle = this.toggle.bind(this);
    this.onChildClick = this.onChildClick.bind(this);
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
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
    const keys = [ 'idEsp', 'region', 'latitude', 'longitude', 'connected', 'powerOn', 'alarmOn'];
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
          <Modal isOpen={this.state.modal} toggle={this.toggle} >
            <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
            <ModalBody>
              {this.state.modalData && 
                keys.map((key) => <div>{key} : {typeof(this.state.modalData[key]) === 'boolean' ? this.state.modalData[key].toString() : this.state.modalData[key]}</div>)
              }
            </ModalBody>
            <ModalFooter>
              <Button color="secondary" onClick={this.toggle}>Cancel</Button>
            </ModalFooter>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Dashboard;