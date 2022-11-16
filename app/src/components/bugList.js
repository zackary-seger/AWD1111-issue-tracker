import {useState, useCallback } from 'react' 
import BugDataService from "../services/bugDataService" 

let bugArray;
let x = 0;

const BugList = props => { 

  const [bugs, setBugs] = useState([]) 

  const response = useCallback(() =>{  

  const bds = new BugDataService('payload.email', 'payload.email');
  
  const bugArray = bds.bugList().then( response => { 

    return response;
    
  }).catch( e =>{ 
    console.log(e) 
  }) 

  setBugs(bugArray);
  return bugArray;

  },[])

  console.log('response const: ' + response);
  console.log(response);
  console.log('x = ' + x);
  console.log(bugs);

}

export { bugArray };
export default BugList;