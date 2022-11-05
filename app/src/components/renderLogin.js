import React, {useState, useEffect } from 'react' 

import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
// import Col from 'react-bootstrap/Col'; 
// import Row from 'react-bootstrap/Row'; 
// import Container from 'react-bootstrap/Container';

import BugDataService from "../services/bugList" 

import { useHistory } from "react-router-dom";

let loginCreds;
let x = 5;

const LoginUser = props => { 

  const [authToken, setAuthToken] = useState([]); 
  const history = (useHistory);

  useEffect(() => { 
    loginUser() 
  }); 

  function loginUser(e) { 

    e.preventDefault();

    const formData = new FormData(e.target);
    loginCreds = Object.fromEntries(formData.entries());

    BugDataService.login(loginCreds.emailInput, loginCreds.passwordInput).then( response => { 

      console.log(response.data); 
      setAuthToken(response.data);

    }).catch( e =>{ 
      console.log(e); 
    }) 

    props.authToken = authToken;

    if ( props.authToken !== null && props.authToken !== undefined ) {
      history("/bugList", { replace: true });
    } else {
      console.log({ error: 'Invalid Credentials. Please Try Again.. (' + x + ' attempts remaining)' });
      x--;
    }
    
  } 

  // Render HTML:
  
  return (

    <Form onSubmit={ LoginUser }>

      <Form.Group className="mb-3" controlId="renderLogin.userCredentials">

        <Form.Label>Email address</Form.Label>
        <Form.Control type="email" placeholder="name@example.com" controlId="emailInput"/>

        <Form.Label>Password</Form.Label>
        <Form.Control type="password" controlId="passwordInput"/>

      </Form.Group>

      <Form.Group className="mb-3" controlId="renderLogin.loginButton">

        <Button 
          variant="primary" 
          type="submit" 
        >
          Login
        </Button> 
        
      </Form.Group>

    </Form>

  );
}

export default LoginUser;



