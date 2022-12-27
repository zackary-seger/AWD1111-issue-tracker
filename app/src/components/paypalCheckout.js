import * as React from "react";
import '../index.css';

import { loadScript } from "@paypal/paypal-js";

let paypal;

async function RenderPaypalCheckout() {

  try {
    paypal = await loadScript({ "client-id": "test" });
  } catch (error) {
    console.error("failed to load the PayPal JS SDK script", error);
  }

  if (paypal) {
      try {
          await paypal.Buttons().render("#your-container-element");
      } catch (error) {
          console.error("failed to render the PayPal Buttons", error);
      }
  }

  // return (
  //   <div className="">

  //   </div>
  // );

}

export default RenderPaypalCheckout;
