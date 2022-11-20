import React, {useState, useCallback, useEffect } from 'react' 

import UserDataService from "../services/userDataService" 
import LoadUserList from "./loadUserList"

let finalArr

const UserList = props => { 

  const [saveArr, setSaveArr] = useState([])
  const [genListBool, setGenListBool] = useState([])

  React.useEffect(() => {  

    const uds = new UserDataService();
    
    uds.UserList().then( response => { 

      console.log(response.data);
      setSaveArr(response.data);
      
    }).catch( e =>{ 
      console.log(e) 
    }) 
     

  }, [genListBool])

  React.useEffect(() => {

    LoadUserList();

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
export default UserList;