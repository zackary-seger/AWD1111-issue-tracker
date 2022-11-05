import React, {useState, useEffect } from 'react' 
import BugDataService from "../services/bugList" 
import { Link } from "react-router-dom" 

let bugArray;

const BugList = props => { 

  const [bugs, setBugs] = useState([]) 

  useEffect(() =>{ 
    retrieveBugs() 
  },[]) 
  
  const retrieveBugs = () =>{ BugDataService.bugList().then( response => { 
    console.log(response.data) 
    setBugs(response.data)
  }).catch( e =>{ 
    console.log(e) 
  }) 
  } 

  bugArray = bugs;

}

export { bugArray };
export default BugList;