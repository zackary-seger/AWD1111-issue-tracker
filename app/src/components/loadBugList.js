import * as ReactDOM from 'react-dom';
import { finalArr } from './bugList';
import RenderNavbar from './navbar';
import bugIcon from '../images/bugIcon.png'

import "../index.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';



function LoadBugList() { 

    let obj1 = finalArr['0'];
    let obj2 = finalArr['1'];
    let obj3 = finalArr['2'];
    let obj4 = finalArr['3'];
    let obj5 = finalArr['4'];

    console.log(obj1);

    function RenderCard() { 
      
      return <div>
      
              <div className="card ms-4 me-4 mb-4">
              <div class="row no-gutters">
                <div class="col-md-4">
                  <img src={bugIcon} class="card-img" alt="Bug Icon"></img>
                </div>
                <div class="col-md-8">

                <div className="card-body mt-3">
                  <h3>Reported Bug No. 001</h3>
                  <h4><b>Title: {obj1.title}</b></h4><br/>
                  <p>Assigned To: {obj1.assignedToUserName}</p>
                  <p>Classification: {obj1.classification}</p>
                  <p>Description: {obj1.description}</p>
                  <p>Reproduction Steps: {obj1.reproductionSteps}</p>
                  <p>bugID: {obj1._id}</p>
                </div>
              </div>
              </div>
              </div>
                    
              <div className="card ms-4 me-4 mb-4">

                <div className="container mt-3">
                  <h3>Reported Bug No. 002</h3>
                  <h4><b>Title: {obj2.title}</b></h4><br/>
                  <p>Assigned To: {obj2.assignedToUserName}</p>
                  <p>Classification: {obj2.classification}</p>
                  <p>Description: {obj2.description}</p>
                  <p>Reproduction Steps: {obj2.reproductionSteps}</p>
                  <p>bugID: {obj2._id}</p>
                </div>

              </div>

                    
              <div className="card ms-4 me-4 mb-4">

                <div className="container mt-3">
                  <h3>Reported Bug No. 003</h3>
                  <h4><b>Title: {obj3.title}</b></h4><br/>
                  <p>Assigned To: {obj3.assignedToUserName}</p>
                  <p>Classification: {obj3.classification}</p>
                  <p>Description: {obj3.description}</p>
                  <p>Reproduction Steps: {obj3.reproductionSteps}</p>
                  <p>bugID: {obj3._id}</p>
                </div>

              </div>

                    
              <div className="card ms-4 me-4 mb-4">

                <div className="container mt-3">
                  <h3>Reported Bug No. 004</h3>
                  <h4><b>Title: {obj4.title}</b></h4><br/>
                  <p>Assigned To: {obj4.assignedToUserName}</p>
                  <p>Classification: {obj4.classification}</p>
                  <p>Description: {obj4.description}</p>
                  <p>Reproduction Steps: {obj4.reproductionSteps}</p>
                  <p>bugID: {obj4._id}</p>
                </div>

              </div>

                    
              <div className="card ms-4 me-4 mb-4">

                <div className="container mt-3">
                  <h3>Reported Bug No. 005</h3>
                  <h4><b>Title: {obj5.title}</b></h4><br/>
                  <p>Assigned To: {obj5.assignedToUserName}</p>
                  <p>Classification: {obj5.classification}</p>
                  <p>Description: {obj5.description}</p>
                  <p>Reproduction Steps: {obj5.reproductionSteps}</p>
                  <p>bugID: {obj5._id}</p>
                </div>

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