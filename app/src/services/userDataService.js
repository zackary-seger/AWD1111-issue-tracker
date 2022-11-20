import React from 'react' 
import axios from "axios"; 

class UserDataService extends React.Component{ 

  constructor(props) {
    super(props);
    this.UserList = this.UserList.bind(this);
  }

  async UserList(){ 
    console.log('Running Axios GET request..')
    return await axios.get(`/user/list`) 
  } 
}

export default UserDataService