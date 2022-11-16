import React, {useState, useCallback, useEffect } from 'react' 
import BugDataService from "../services/bugDataService" 

let bugArray;

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

  console.log('saveArr: ' + saveArr);
  console.log(saveArr);

  React.useEffect(() => {
    return (
      <div>
        <div className="card bug">

          <img src="../images/img_avatar.png" alt="Avatar"></img>
          <div class="container">
            <h4><b>{saveArr['0']}</b></h4>
            <p>Found By: Zackary Seger</p>
          </div>

        </div>
      </div>  
    )
  }, [saveArr]);

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

export { bugArray };
export default BugList;