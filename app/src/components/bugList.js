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

    <LoadBugList />

  }, [saveArr]);

  console.log('saveArr: ' + saveArr);
  console.log(saveArr);
  finalArr = saveArr;

  return (
    <div>
      <p className='mb-2'>If you have properly logged in, click the button for an updated bugList!</p>
      <button onClick={() => 
        setGenListBool(true)
      }>
        Generate List
      </button>
    </div>
  );

}

export { finalArr };
export default BugList;