import React from 'react';
import Joi from "joi"
import { useValidator } from "react-joi"

function CreateValidator() {

  const { state, setData, setExplicitField, validate } = useValidator({
    initialData: {
        name: null,
        email: null,
    },
    schema: Joi.object({
        email: Joi.string()
            .email({
                tlds: { allow: false },
            })
            .required(),
        password: Joi.string().min(8).required(),
    }),
    explicitCheck: {
        email: false,
        password: false,
    },
    validationOptions: {
        abortEarly: true,
    },
  })
  
  const updateEmail = (e) => {
    // react < v17
    e.persist()

    setData((old) => ({
        ...old,
        email: e.target.value,
    }))
  }

  const updatePassword = (e) => {
    // react < v17
    e.persist()

    setData((old) => ({
        ...old,
        password: e.target.value,
    }))
  }
}

export default CreateValidator;