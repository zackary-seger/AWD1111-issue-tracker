import * as ReactDOM from 'react-dom';
import { finalArr } from './bugList';

function LoadBugList() { 

    let obj1 = finalArr['0'];
    console.log(obj1);

    function RenderCard() { 
      
      return <div className="card">

               <img src="../images/img_avatar.png" alt="Avatar"></img>
               <div class="container">
                 <h4><b>{obj1.title}</b></h4>
                 <p>Found By: Zackary Seger</p>
               </div>

             </div>
    
    }

    if (obj1) {

      console.log(obj1.title);

      const root = ReactDOM.createRoot(document.getElementById('root')); 
      root.render(<RenderCard />)

      
    }

}

export default LoadBugList