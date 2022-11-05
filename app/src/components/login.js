import React, {useState, useEffect } from 'react' 
import BugDataService from "../services/bugList" 
import { Link } from "react-router-dom" 

let savedAuthToken;

const UserLogin = props => { 

  const [authToken, setAuthToken] = useState([]) 

  useEffect(() =>{ 
    loginUser() 
  },[]) 
  
  const loginUser = () => { BugDataService.login().then( response => { 
    console.log(response.data) 
    setAuthToken(response.data)
  }).catch( e =>{ 
    console.log(e) 
  }) 
  } 

  savedAuthToken = authToken;

}

export { savedAuthToken };
export default UserLogin;