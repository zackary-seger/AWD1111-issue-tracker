import React, {useState, useEffect } from 'react' 
import BugDataService from "../services/bugDataService" 
import Cookies from 'js-cookie';
import { Link } from "react-router-dom" 

let bugArray;

const BugList = props => { 

  const [bugs, setBugs] = useState([]) 
  const [auth, setAuth] = useState([]) 

  useEffect(() =>{ 
    retrieveBugs() 
  }) 

  setAuth({ authToken: Cookies.get() })
  
  const retrievedToken = auth.authToken;

  // const payload = jwt.verify(retrievedToken, secret);

  const bds = new BugDataService('payload.email', 'payload.email');

  const retrieveBugs = () =>{ bds.bugList().then( response => { 
    console.log(response.data) 
    setBugs(response.data)
    return response;
  }).catch( e =>{ 
    console.log(e) 
  }) 
  } 

  bugArray = bugs;

}

export { bugArray };
export default BugList;