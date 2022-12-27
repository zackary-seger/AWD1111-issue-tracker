import React, { useState, useEffect } from "react";
import RenderPaypalForm from "./renderPaypalForm";

const Checkout = () => {


    useEffect(() => {

          RenderPaypalForm();

    });

}

export default Checkout