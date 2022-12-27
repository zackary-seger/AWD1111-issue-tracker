import * as React from "react";
import '../index.css';

import { loadScript } from "@paypal/paypal-js";
import '../index.css';

class PaypalCheckout extends React.Component {

  async RenderPaypalCheckout() {

    let paypal;

    try {
        paypal = await loadScript({ "client-id": "test" });
    } catch (error) {
        console.error("failed to load the PayPal JS SDK script", error);
    }
    
    if (paypal) {
        try {
            await paypal.Buttons().render(document.getElementById('body'));
        } catch (error) {
            console.error("failed to render the PayPal Buttons", error);
        }
    }

  }
}

export default PaypalCheckout;
