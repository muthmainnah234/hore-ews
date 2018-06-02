import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import NavBarCustom from './NavbarCustom'
import axios from 'axios';

const Siren = ({ text }) => <div><img style={{ height: '40px', width: '40px' }} src="http://www.wfgnj.com/wp-content/uploads/2014/07/bullhorn-1024x1024.png" /></div>;

class Dashboard extends Component {
  static defaultProps = {
    center: {
      lat: -6.9175,
      lng: 107.6191
    },
    zoom: 7
  };

  constructor(props) {
    super(props);
    this.state = {
      alarms: []
    };
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
            >
              {alarms.map((alarm) => <Siren lat={alarm.latitude} lng={alarm.longitude} />)}
            </GoogleMapReact>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;