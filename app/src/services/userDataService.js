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
    console.log('canRunAxiosRequest: TRUE')
    return console.log(`udsInput: ${udsInput}`)
  }

  async UserList(){ 
    console.log('Running Axios GET request..')
    return await axios.get(`/api/user/list`) 
  } 
}

export default UserDataService