import React, {useState, useEffect, useCallback } from 'react' 
import BugDataService from "../services/bugDataService" 
import Cookies from 'js-cookie';
import { Link } from "react-router-dom" 

let bugArray;

const BugList = props => { 

  const [bugs, setBugs] = useState([]) 

  useCallback(() =>{   
    const bds = new BugDataService('payload.email', 'payload.email');
    
    bds.bugList().then( response => { 
    console.log(response.data) 
    setBugs(response.data)
    return response;
  }).catch( e =>{ 
    console.log(e) 
  }) 
  },[])

  bugArray = bugs;

}

export { bugArray };
export default BugList;