import React from 'react' 
import axios from "axios"; 

const defaultInputs = {
  emailInput: "",
  passwordInput: "",   
  firstNameInput: "",
  lastNameInput: ""
}

class UserDataService extends React.Component{ 

  constructor(emailInput, passwordInput, firstNameInput, lastNameInput, props) {
    super(props);
    this.UserList = this.UserList.bind(this);

    this.emailInput = emailInput || defaultInputs.emailInput;
    this.passwordInput = passwordInput || defaultInputs.passwordInput;
    this.firstNameInput = firstNameInput || defaultInputs.firstNameInput;
    this.lastNameInput = lastNameInput || defaultInputs.lastNameInput;
  }

  async RegisterUser(udsInput){
    let resp = null;

    await axios({
      method: "put",
      withCredentials: true,
      url: "api/user/register",
      data: {email: `${this.emailInput}`,
             password: `${this.passInput}`,
             firstNameInput: `${this.firstNameInput}`,
             lastNameInput: `${this.lastNameInput}`            
            },
      headers: { "Content-Type": "application/json" },
    }).catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    }).then(function (response) {
      //handle success
      console.log(response);
      resp = response; 
    })
    .catch(function (response) {
      //handle error
      console.log(response);
    });
    
    return resp;
  }

  async UserList(){ 
    console.log('Running Axios GET request..')
    return await axios.get(`/api/user/list`) 
  } 
}

export default UserDataService