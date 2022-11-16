import {useState, useCallback } from 'react' 
import BugDataService from "../services/bugDataService" 

let bugArray;
let x = 0;

const BugList = props => { 

  const [bugs, setBugs] = useState([]) 

  const response = useCallback(() =>{  

    const bds = new BugDataService('payload.email', 'payload.email');
    
    bds.bugList().then( response => { 
    if ( x === 0 && response) {
      setBugs(response);
      x++;
    }

    return response;
  }).catch( e =>{ 
    console.log(e) 
  }) 
  },[])

  bugArray = bugs;
  console.log(bugArray);

}

export { bugArray };
export default BugList;