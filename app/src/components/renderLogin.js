import React from 'react';
import Joi from "joi"
import Cookies from 'js-cookie';

import Form from 'react-bootstrap/Form'; 
import Button from 'react-bootstrap/Button'; 
import CreateValidator from './validate.js';

import BugDataService from "../services/bugDataService";

import { FaSignInAlt } from "react-icons/fa";

let x = 1;

const loginSchema = Joi.object().keys({
  username: Joi.string().required(),
  password: Joi.string().min(8).required()
});

class LoginForm extends React.Component {
  
  constructor(props) {
    
    super(props);

    this.loginUser = this.loginUser.bind(this);

    this.emailInput = React.createRef();
    this.passwordInput = React.createRef();

    this.focusInput = this.focusInput.bind(this);

  }

  focusInput() {

    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    if (x !== 1) {
      this.focusInput.current.focus();
    } else {
      x++;
    }

    // this.emailInput.current.focus();
    // this.passwordInput.current.focus();

  }

  async loginUser(event, props, ref) { 

    event.preventDefault();

    // const formData = new FormData();

    // console.log('this.emailInput object: ' + JSON.stringify(this.emailInput));

    // formData.append('email', this.emailInput.current.value);
    // formData.append('password', this.passwordInput.current.value);

    // loginCreds = Object.fromEntries(formData.entries());

    // console.log('credentials object: ' + JSON.stringify(loginCreds));    

    let emailTxt = this.emailInput.current.value;
    let passTxt = this.passwordInput.current.value;
    
    let joiObj = loginSchema.validate({email: emailTxt, password: passTxt});

    console.log('\n');
    console.log('emailTxt: ' + joiObj.value['email'] + '  |  passTxt: ' + joiObj.value['password']);
    console.log('\n');

    let bds = new BugDataService(joiObj.value['email'], joiObj.value['password']); 

    let bdsResp = bds.login().then( response => { 

      console.log('response: ' + response); 
      return response;

    }).catch( e =>{ 
      console.log(e); 
    }) 

    console.log('response/savedToken: ' + bdsResp); 

    this.state = { authToken: Cookies.get() }
    console.log(this.state);

    // if (this.state) {
    //   if (typeof window !== 'undefined') {
    //     window.location.href = "https://www.boatborrowers.com/bug/list";
    //   }
    // }

    // if ( bdsResp !== null ) {
    //   history("/bugList", { replace: true });
    // } else {
    //   console.log({ error: 'Invalid Credentials. Please Try Again.. (' + x + ' attempts remaining)' });
    //   x--;
    // }
    
  } 
  

  // Render HTML:
  
  render() {

    const validator = CreateValidator; 

    return (
      <div>

      <body>
        <h1 className="pt-3">User Login  <FaSignInAlt id="signIn1" className="ms-2"/></h1>

        <Form className="mt-3 me-3" onSubmit={ this.loginUser }>

          <Form.Group className="mb-3 me-3" controlId="renderLogin.userCredentials">

            <Form.Label className='font-weight-bold ps-1'>Email address</Form.Label>
            <Form.Control onChange={ validator.updateEmail } className="mb-1" type="email" placeholder="name@example.com" controlId="emailInput" ref={ this.emailInput } />

            <Form.Label className="font-weight-bold mt-2 ps-1">Password</Form.Label>
            <Form.Control onChange={ validator.updatePassword } className="pb-2" type="password" controlId="passwordInput" id="passwordTxt" ref={ this.passwordInput } />

          </Form.Group>

          <Form.Group className="mb-3 mt-2" controlId="renderLogin.loginButton">

            <Button 
              variant="primary" 
              type="submit"
              onClick={this.focusInput}
            >
              Login
            </Button> 
            
          </Form.Group>

        </Form>
      </body>
      </div>  
    );
  }
}
 
export default LoginForm;
