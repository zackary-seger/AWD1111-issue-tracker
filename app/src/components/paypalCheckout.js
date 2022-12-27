import * as React from "react";
import '../index.css';

import { loadScript } from "@paypal/paypal-js";
import '../index.css';

class PaypalCheckout extends React.Component {
  
  constructor(bool, y, props) {
    
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

  async RenderPaypalCheckout() {

    loadScript({ "client-id": "test" })
    .then((paypal) => {
        paypal
            .Buttons()
            .render()
            .catch((error) => {
                console.error("failed to render the PayPal Buttons", error);
            });
    })
    .catch((error) => {
        console.error("failed to load the PayPal JS SDK script", error);
    });

  }


  // Render HTML:
  render() {
      
      return console.log(this._isNewUser)

  }
}

export default PaypalCheckout;
