import React, {useState, useCallback, useEffect } from 'react' 

import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 

function RenderRF(...props) {

  const [isNewUser, setIsNewUser] = useState([]);
  setIsNewUser(props.isNewUser);

  console.log(`isNewUser prop: ${isNewUser}`)

  if (isNewUser) {

    return ( <body className='mb-2'>

                <h1 className="pt-3 ms-3">User Registration</h1>
            
                <Form className="mt-3 ms-3 me-3" onSubmit={ this.registerUser }>
            
                  <Form.Group className="mb-3 me-3" controlId="renderLogin.userCredentials">
            
                    <Form.Label className='font-weight-bold ps-1'>Email Address</Form.Label>
                    <Form.Control className="mb-1" type="email" placeholder="name@example.com" controlId="emailInput" ref={ this.emailInput } />
            
                    <Form.Label className="font-weight-bold mt-2 ps-1">Password</Form.Label>
                    <Form.Control className="pb-2" type="password" controlId="passwordInput" id="passwordTxt" ref={ this.passwordInput } />
            
                    <Form.Label className="font-weight-bold mt-2 ps-1">First Name</Form.Label>
                    <Form.Control className="pb-2" type="text" controlId="firstNameInput" id="firstNameTxt" ref={ this.firstNameInput } />
            
                    <Form.Label className="font-weight-bold mt-2 ps-1">Last Name</Form.Label>
                    <Form.Control className="pb-2" type="text" controlId="lastNameInput" id="lastNameTxt" ref={ this.lastNameInput } />
            
                  </Form.Group>      
            
                  <Form.Group className="mb-3" controlId="renderLogin.loginButton">
            
                    <Button 
                      variant="primary" 
                      type="submit"
                      onClick={this.focusInput}
                      className="mt-2 mb-4"
                      id="loginBtn"
                    >
                      Register
                    </Button> 
                    
                  </Form.Group>
            
                </Form>

    </body>

  )}

}

export default RenderRF