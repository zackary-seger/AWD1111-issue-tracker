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

  useEffect(() => {
    return (
      <div className="card bug">

        <img src="../images/img_avatar.png" alt="Avatar"></img>
        <div class="container">
          <h4><b>{bugs.filter( (x) => { 

            let n=0; 
            if (n === 0){ 
              n++; 
              return x.title + '\n'
            } else {
              return null
            }

            })}</b></h4>
          <p>Found By: Zackary Seger</p>
        </div>

      </div>
    )
  }, [bugs]);

  return (
    <div>
      <p className='mb-2'>If you have properly logged in, click the button for an updated bugList!</p>
      <button onClick={() => 
        setBugs(saveArr.data)
      }>
        Generate List
      </button>
    </div>
  );

}

export { bugArray };
export default BugList;