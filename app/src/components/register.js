import '../index.css';

import React from 'react';
import Joi from "joi"
import * as ReactDOM from 'react-dom/client';
import RenderUserRegistration, { isCancelledSave, ifAlreadyRendered } from './renderRegisterForm';
import UserDataService from "../services/userDataService";
import LoginForm, { isNewUserSave } from './renderLogin';
import { isRendered } from './renderRegisterForm';

const registerSchema = Joi.object().keys({

  email: Joi.string().email({ tlds: { allow: false } , minDomainSegments: 2 }).trim().required(),
  password: Joi.string().trim().min(8).required().min(8).max(25)
                  .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,'password'),
  firstName: Joi.string().min(1).trim().required(),
  lastName: Joi.string().min(1).trim().required()

});

let x = 1;
let y = 1;

const validationOptions = {
  abortEarly: false  // abort after the last validation error
  // allowUnknown: true, // allow unknown keys that will be ignored
  // stripUnknown: true  // remove unknown keys from the validated data
};

class RegisterForm extends React.Component {
  
  constructor(bool, props) {
    
    super(props);

    this.registerUser = this.registerUser.bind(this);

    this.emailInput = React.createRef();
    this.passwordInput = React.createRef();
    this.firstNameInput = React.createRef();
    this.lastNameInput = React.createRef();

    this._isNewUser = bool;
    this._validObj = null;
    this._resp = {};

    this.focusInput = this.focusInput.bind(this);

  }

  renderConditionalUserRegistration() {

    console.log('\n');
    console.log('Conditional Render Function Begin..');
    console.log('\n');

    console.log(`isRenderedSave: ${isRendered}`);
    console.log(`isNewUserSave: ${isNewUserSave}`);

    if (isNewUserSave && isCancelledSave === false && (isRendered === false || ifAlreadyRendered === true) ) { 
      
      console.log('Conditional Render Function return root.render() Commencing..');
      
      isNewUserSave = false;

      const body = ReactDOM.createRoot(document.getElementById('body'));
      return body.render(<RenderUserRegistration /> );
    
    }

    console.log('\n');
    console.log('Conditional Render Function Complete..');
    console.log('\n');
    
  }

  focusInput() {

    // Explicitly focus the text input using the raw DOM API
    // Note: we're accessing "current" to get the DOM node
    if (x !== 1) {
      this.focusInput.current.focus();
    } else {
      x++;
    }

  }

  async registerUser(event, props, ref) { 

    event.preventDefault();
    this.renderConditionalRegister();

    let emailTxt = this.emailInput.current.value;
    let passTxt = this.passwordInput.current.value;
    let firstNameTxt = this.firstNameInput.current.value;
    let lastNameTxt = this.lastNameInput.current.value;

    let userRegistrationObj = {email: emailTxt, password: passTxt, firstName: firstNameTxt, lastName: lastNameTxt};
    
    registerSchema.validate(userRegistrationObj, registerSchema, validationOptions, (err, data) => {
      if (err) {
        // Joi Error
        const JoiError = {
          status: 'failed',
          error: {
            original: err._object,
            // fetch only message and type from each error
            details: _.map(err.details, ({message, type}) => ({
              message: message.replace(/['"]/g, ''),
              type
            }))
          }
        };

        // Custom Error
        const CustomError = {
          status: 'failed',
          error: 'Invalid request data. Please review request and try again.'
        };

        // Send back the error response
        console.log(JoiError);
        console.log(CustomError);

      } else {
        // Replace userRegistrationObj with the data after Joi validation
        userRegistrationObj = data;
      }
    });

    userRegistrationObj.role = null;

    let uds = new UserDataService(userRegistrationObj); 

    uds.Register.then( response => { 
      this._resp = response;
      console.log(response);
    }).catch( e =>{ 
      console.log(e); 
    }) 

  }   

  // Render HTML:
  render() {
      
      return console.log(this._isNewUser)

  }
}
 
export default RegisterForm;
