import { PayPalScriptProvider, PayPalButtons } from "@paypal/react-paypal-js";
import React, { useState, useEffect } from "react";
import { CLIENT_ID } from "../Config/Config.js";
import * as ReactDOM from 'react-dom';
import RenderNavbar from './navbar';
import RenderLowerNavbar from './bugListLowerNav';

let finalArr;

function RenderPaypalForm() { 
 
  const [show, setShow] = useState(false);
  const [ErrorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderID, setOrderID] = useState(false);

  let obj1 = finalArr['0'];
  console.log(obj1);

      // creates a paypal order
      const createOrder = (data, actions) => {
        return actions.order.create({
            purchase_units: [
                {
                    description: "Sunflower",
                    amount: {
                        currency_code: "USD",
                        value: 20,
                    },
                },
            ],
        }).then((orderID) => {
                setOrderID(orderID);
                return orderID;
            });
    };

    // check Approval
    const onApprove = (data, actions) => {
        return actions.order.capture().then(function (details) {
            const { payer } = details;
            setSuccess(true);
        });
    };

    //capture likely error
    const onError = (data, actions) => {
        setErrorMessage("An Error occured with your payment ");
    };

  function RenderCard() { 
    
    return (
      <div>
        <PayPalScriptProvider options={{ "client-id": CLIENT_ID }}>
            <div>
                <div className="wrapper">
                    <div className="product-img">
                        <img
                            src="https://cdn.pixabay.com/photo/2021/08/15/06/54/sunflower-6546993_1280.jpg"
                            alt="SunFlower"
                            height="320"
                            width="300" />
                    </div>
                    <div className="product-info">
                        <div className="product-text">
                            <h1>Sunflower</h1>
                        </div>
                        <div className="product-price-btn">
                            <p>$20</p>
                            <br></br>
                            <button className='buy-btn' type="submit" onClick={() => setShow(true)}>
                                Buy now
                            </button>
                        </div>
                    </div>
                </div>
                <br></br>
                {show ? (
                    <PayPalButtons
                        style={{ layout: "vertical" }}
                        createOrder={createOrder}
                        onApprove={onApprove}
                    />
                ) : null}
            </div>
        </PayPalScriptProvider>
      </div>
    );
  }

  const root = ReactDOM.createRoot(document.getElementById('root')); 

  if (obj1) {

    console.log(obj1.title);
    root.render(
      
    <div>

      <RenderNavbar />
      <RenderLowerNavbar />
      <RenderCard />
    
    </div>)
    
  }

}

export default RenderPaypalForm();