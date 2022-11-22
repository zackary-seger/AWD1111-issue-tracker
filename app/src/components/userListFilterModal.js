import React from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import InputGroup from 'react-bootstrap/InputGroup';

function MyXYControlledModal(props) {

  return (

    <Modal
      {...props}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      centered>

      <Modal.Header closeButton>

        <Modal.Title id="contained-modal-title-vcenter">
          Filter Users
        </Modal.Title>

      </Modal.Header>

      <Modal.Body>

        <InputGroup className="mb-3">
          <InputGroup.Text id="searchInputTxt">Search Users</InputGroup.Text>
          <Form.Control
            aria-label="search bar"
            aria-describedby="basic-addon1"
          />
          <Button id="searchInputButton">Search</Button>
        </InputGroup>

      </Modal.Body>

      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>

    </Modal>
  );
}

export default MyXYControlledModal