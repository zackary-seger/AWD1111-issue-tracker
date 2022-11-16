import {useState, useCallback, useEffect } from 'react' 
import BugDataService from "../services/bugDataService" 

let bugArray;

const BugList = props => { 

  const [bugs, setBugs] = useState([]) 

  const response = useEffect(() =>{  

    const bds = new BugDataService('payload.email', 'payload.password');
    
    bugArray = bds.bugList().then( response => { 

      console.log(response);
      return response;
      
    }).catch( e =>{ 
      console.log(e) 
    }) 

    console.log('bugArray: ' + bugArray);
    return bugArray;

  },[bugs])

  console.log('response const: ' + response);
  console.log('bugArray let: ' + bugArray);
  console.log(response);
  console.log(bugs);

  return (
    <div>
      <p className='mb-2'>If you have properly logged in, click the button for an updated bugList!</p>
      <button onClick={() => setBugs(BugList)}>
        Generate List
      </button>
    </div>
  );

}

export { bugArray };
export default BugList;