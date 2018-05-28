import React, { Component } from 'react';
import axios from 'axios';
import NavbarCustom from './NavbarCustom';

class Phone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      phones: [],
    };
  }
  
  componentDidMount() {
    axios.get('http://localhost:8080/phone')
      .then(({data}) => {
        if (data.success) {
          this.setState({
            phones: data.result
          });
        }
      })
      .catch((err) => {
        alert('Cannot connect to url');
      })
  }
  
  render() {
    const phones = this.state.phones;
    return (
      <div>
        <NavbarCustom/>
        <div className="container py-5">
          <h2 className="mb-5" >Daftar Nomor Telepon Penduduk</h2>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>No</th>
                <th>Nama</th>
                <th>Nomor Telepon</th>
                <th>Region</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {
                phones.map((phone, key) => {
                  return (
                    <tr>
                      <td>{key+1}</td>
                      <td>{phone.name}</td>
                      <td>{phone.phonenumber}</td>
                      <td>{phone.region}</td>
                      <td><button className="btn btn-secondary" data-toggle="modal" data-target={'#' + phone._id}>Ubah</button></td>
                      <div class="modal fade" id={phone._id}>
                        <div class="modal-dialog modal-dialog-centered">
                          <div class="modal-content">
                            <form className="form" >
                            <div class="modal-body">
                              <div className="row" >
                                <div className="col-md-auto" >
                                  <div>Nama</div>
                                  <div>Nomor Telepon</div>
                                  <div>Region</div>
                                </div>
                                <div className="col-md-auto" >
                                  :<br/>:<br/>:
                                </div>
                                <div className="col" >
                                  <div>{phone.name}</div>
                                  <div>{phone.phonenumber}</div>
                                  <div>{phone.region}</div>
                                </div>
                              </div>
                            </div>
                            <div class="modal-footer">
                              <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                            </div>
                            </form>
                          </div>
                        </div>
                      </div>
                    </tr>
                  );
                })
              }
            </tbody>
          </table>
          <div className="text-center mt-5" >
              <button className="btn btn-primary" >Tambah</button>
              {/* <div class="modal fade" id={phone._id}>
                <div class="modal-dialog modal-dialog-centered">
                  <div class="modal-content">
                    <form className="form" >
                    <div class="modal-body">
                      <div className="row" >
                        <div className="col-md-auto" >
                          <div>Nama</div>
                          <div>Nomor Telepon</div>
                          <div>Region</div>
                        </div>
                        <div className="col-md-auto" >
                          :<br/>:<br/>:
                        </div>
                        <div className="col" >
                          <div>{phone.name}</div>
                          <div>{phone.phonenumber}</div>
                          <div>{phone.region}</div>
                        </div>
                      </div>
                    </div>
                    <div class="modal-footer">
                      <button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
                    </div>
                    </form>
                  </div>
                </div>
              </div> */}
          </div>
      </div>
    </div>
    );
  }
}

export default Phone;