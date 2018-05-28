import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class NavbarCustom extends Component {
	render() {
		return (
      <div>
        <nav className="navbar navbar-expand-sm navbar-dark bg-dark" >
          <div className="container-fluid" >
            <ul class="navbar-nav">
              <li class="nav-item active">
                <a class="nav-link" href="#">Beranda</a>
              </li>
              <li class="nav-item">
                {/* <a class="nav-link" href="#">Buku Telepon</a> */}
                <Link class="nav-link" to={`/phone`}>Buku Telepon</Link>
              </li>
              <li class="nav-item">
                {/* <a class="nav-link" href="#">Dashboard Alarm</a> */}
                <Link class="nav-link" to={`/dashboard`}>Dashboard EWS</Link>
              </li>
            </ul>
            <ul class="nav navbar-nav navbar-right">
              <li class="nav-item">
                <a class="nav-link" href="#">Logout</a>
              </li>
            </ul>
          </div>
        </nav>
      </div>
    );
	}
}

export default NavbarCustom;