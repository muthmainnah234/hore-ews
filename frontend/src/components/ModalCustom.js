import React, { Component } from 'react';
import { Modal, ModalBody, ModalHeader, ModalFooter, Button } from 'reactstrap';

class ModalCustom extends Component {
	constructor(props) {
		super(props);
		this.state = {
      modal: true
    }
    
    this.toggle = this.toggle.bind(this);
	}

  toggle() {
    this.setState({
      modal: !this.props.modal
    });
  }

	render() {
		const data = this.props.data;
		return (
        <Modal isOpen={this.state.modal} toggle={this.toggle} >
          <ModalHeader toggle={this.toggle}>Modal title</ModalHeader>
          <ModalBody>
            {data.region}
          </ModalBody>
          <ModalFooter>
            <Button color="secondary" onClick={this.toggle}>Cancel</Button>
          </ModalFooter>
        </Modal>
		);
	}
}

export default ModalCustom;