import React, {useState, useEffect, useCallback } from 'react' 
import BugDataService from "../services/bugDataService" 
import Cookies from 'js-cookie';
import { Link } from "react-router-dom" 

let bugArray;

const BugList = props => { 

  const [bugs, setBugs] = useState([]) 

  const response = useCallback(() =>{   
    const bds = new BugDataService('payload.email', 'payload.email');
    
    bds.bugList().then( response => { 
    console.log(response.data) 
    return response;
  }).catch( e =>{ 
    console.log(e) 
  }) 
  },[])

  setBugs(response)
  bugArray = bugs;
  console.log(bugArray);

}

export { bugArray };
export default BugList;