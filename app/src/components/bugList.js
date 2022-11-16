import {useState, useCallback } from 'react' 
import BugDataService from "../services/bugDataService" 

let bugArray;

const BugList = props => { 

  const [bugs, setBugs] = useState([]) 

  const response = useCallback(() =>{   
    const bds = new BugDataService('payload.email', 'payload.email');
    
    bds.bugList().then( response => { 
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