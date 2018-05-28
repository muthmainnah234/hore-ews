import React, { Component } from 'react';
import GoogleMapReact from 'google-map-react';
import NavBarCustom from './NavbarCustom'

const Siren = ({ text }) => <div><img style={{ height: '40px', width: '40px' }} src="http://www.wfgnj.com/wp-content/uploads/2014/07/bullhorn-1024x1024.png" /></div>;

class Dashboard extends Component {
  static defaultProps = {
    center: {
      lat: -6.9175,
      lng: 107.6191
    },
    zoom: 7
  };

  render() {
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
              <Siren
                lat={-6.9175}
                lng={107.6191}
              />
              <Siren
                lat={-6.1751}
                lng={106.8650}
              />
            </GoogleMapReact>
          </div>
        </div>
      </div>
    );
  }
}

export default Dashboard;