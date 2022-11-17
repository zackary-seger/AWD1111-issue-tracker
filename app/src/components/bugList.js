import React, {useState, useCallback, useEffect } from 'react' 

import BugDataService from "../services/bugDataService" 
import LoadBugList from "./loadBugList"

let bugArray;
let finalArr

const BugList = props => { 

  const [bugs, setBugs] = useState([]) 
  const [saveArr, setSaveArr] = useState([])
  const [genListBool, setGenListBool] = useState([])

  React.useEffect(() => {  

    const bds = new BugDataService('payload.email', 'payload.password');
    
    bugArray = bds.bugList().then( response => { 

      console.log(response.data);
      setSaveArr(response.data);
      
    }).catch( e =>{ 
      console.log(e) 
    }) 
     

  }, [genListBool])

  React.useEffect(() => {

    LoadBugList();

  }, [saveArr]);

  console.log('saveArr: ' + saveArr);
  console.log(saveArr);
  finalArr = saveArr;

  return (
    <div>

      <b><p id='U401' className='mb-1 text-danger'>Unauthorized: You must be signed in to view this page..</p></b>

      <a className='mb-2' href="/">
        <button id='btnLogin'>
          Go To Login
        </button>
      </a>

    </div>
  );

}

export { finalArr };
export default BugList;