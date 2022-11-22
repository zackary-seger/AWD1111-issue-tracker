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
          <InputGroup.Text id="basic-addon1">Search Users</InputGroup.Text>
          <Form.Control
            placeholder="Username"
            aria-label="Username"
            aria-describedby="basic-addon1"
          />
        </InputGroup>

      </Modal.Body>

      <Modal.Footer>
        <Button onClick={props.onHide}>Close</Button>
      </Modal.Footer>

    </Modal>
  );
}

export default MyXYControlledModal