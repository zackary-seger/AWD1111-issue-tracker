import {useState, useCallback, useEffect } from 'react' 
import BugDataService from "../services/bugDataService" 

let bugArray;

const BugList = props => { 

  const [bugs, setBugs] = useState([]) 
  const [saveArr, setSaveArr] = useState([])

  const response = useEffect(() =>{  

    const bds = new BugDataService('payload.email', 'payload.password');
    
    bugArray = bds.bugList().then( response => { 

      console.log(response.data);
      setSaveArr(response);
      
    }).catch( e =>{ 
      console.log(e) 
    }) 
    
    return saveArr; 

  })

  console.log('saveArr: ' + saveArr);
  console.log(saveArr);

  return (
    <div>
      <p className='mb-2'>If you have properly logged in, click the button for an updated bugList!</p>
      <button onClick={() => setBugs(saveArr)}>
        Generate List
      </button>
    </div>
  );

}

export { bugArray };
export default BugList;