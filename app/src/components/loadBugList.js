import * as ReactDOM from 'react-dom';
import { finalArr } from './bugList';
import RenderNavbar from './navbar';

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';


function LoadBugList() { 

    let obj1 = finalArr['0'];
    console.log(obj1);

    function RenderCard() { 
      
      return <div className="card">

               <img src="./images/img_avatar.png" alt="Avatar"></img>
               <div class="container">
                 <h4><b>{obj1.title}</b></h4>
                 <p>Found By: Zackary Seger</p>
               </div>

             </div>
    
    }

    const root = ReactDOM.createRoot(document.getElementById('root')); 

    if (obj1) {

      console.log(obj1.title);
      root.render(<div><RenderNavbar /><RenderCard /></div>)
      
    }

}

export default LoadBugList