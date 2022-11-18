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
      
      return <div className='container-fluid'>

              <div className='row ms-3 me-3'>
      
                <div className="col-sm card ms-4 me-4 mb-4">
                <div class="row no-gutters">

                  <div id="img1div" class="col-md-4">
                    <img id='img1' src={bugIcon} class="card-img ps-3" alt="Bug Icon"></img>
                  </div>

                  <div id="cardBodyDiv" class="col-md-8 ps-3 pe-3 pt-1">

                    <div className="card-body mt-3">
                      <h3>Reported Bug No. 001</h3>
                      <h4>Title: <b>{obj1.title}</b></h4><br/>
                      <p>Assigned To: {obj1.assignedToUserName}</p>
                      <p>Classification: {obj1.classification}</p>
                      <p>Description: {obj1.description}</p>
                      <p>Reproduction Steps: {obj1.reproductionSteps}</p>
                      <p>bugID: {obj1._id}</p>
                    </div>
                  </div>
                </div>

                </div>
                      
                      
              <div className="col-sm card ms-4 me-4 mb-4">
                <div class="row no-gutters">
                  
                  <div id="img1div" class="col-md-4">
                    <img id='img1' src={bugIcon} class="card-img ps-3" alt="Bug Icon"></img>
                  </div>

                  <div id="cardBodyDiv" class="col-md-8 ps-3 pe-3 pt-1">

                    <div className="card-body mt-3">
                      <h3>Reported Bug No. 002</h3>
                      <h4>Title: <b>{obj2.title}</b></h4><br/>
                      <p>Assigned To: {obj2.assignedToUserName}</p>
                      <p>Classification: {obj2.classification}</p>
                      <p>Description: {obj2.description}</p>
                      <p>Reproduction Steps: {obj2.reproductionSteps}</p>
                      <p>bugID: {obj2._id}</p>
                    </div>
                  </div>
                </div>

                </div>

                      
                <div className="col-sm card ms-4 me-4 mb-4">
                <div class="row no-gutters">
                  
                  <div id="img1div" class="col-md-4">
                    <img id='img1' src={bugIcon} class="card-img ps-3" alt="Bug Icon"></img>
                  </div>

                  <div id="cardBodyDiv" class="col-md-8 ps-3 pe-3 pt-1">

                    <div className="card-body mt-3">
                      <h3>Reported Bug No. 003</h3>
                      <h4>Title: <b>{obj3.title}</b></h4><br/>
                      <p>Assigned To: {obj3.assignedToUserName}</p>
                      <p>Classification: {obj3.classification}</p>
                      <p>Description: {obj3.description}</p>
                      <p>Reproduction Steps: {obj3.reproductionSteps}</p>
                      <p>bugID: {obj3._id}</p>
                    </div>
                  </div>
                </div>

                </div>

              </div>

              <div className='row  ms-3 me-3'>

              <div className="col-sm card ms-4 me-4 mb-4">
                <div class="row no-gutters">
                  
                  <div id="img1div" class="col-md-4">
                    <img id='img1' src={bugIcon} class="card-img ps-3" alt="Bug Icon"></img>
                  </div>

                  <div id="cardBodyDiv" class="col-md-8 ps-3 pe-3 pt-1">

                    <div className="card-body mt-3">
                      <h3>Reported Bug No. 004</h3>
                      <h4>Title: <b>{obj4.title}</b></h4><br/>
                      <p>Assigned To: {obj4.assignedToUserName}</p>
                      <p>Classification: {obj4.classification}</p>
                      <p>Description: {obj4.description}</p>
                      <p>Reproduction Steps: {obj4.reproductionSteps}</p>
                      <p>bugID: {obj4._id}</p>
                    </div>
                  </div>
                </div>

                </div>

                    
                <div className="col-sm card ms-4 me-4 mb-4">
                <div class="row no-gutters">
                  
                  <div id="img1div" class="col-md-4">
                    <img id='img1' src={bugIcon} class="card-img ps-3" alt="Bug Icon"></img>
                  </div>

                  <div id="cardBodyDiv" class="col-md-8 ps-3 pe-3 pt-1">

                    <div className="card-body mt-3">
                      <h3>Reported Bug No. 005</h3>
                      <h4>Title: <b>{obj5.title}</b></h4><br/>
                      <p>Assigned To: {obj5.assignedToUserName}</p>
                      <p>Classification: {obj5.classification}</p>
                      <p>Description: {obj5.description}</p>
                      <p>Reproduction Steps: {obj5.reproductionSteps}</p>
                      <p>bugID: {obj5._id}</p>
                    </div>
                  </div>
                </div>

                </div>

                <div className="col-sm card ms-4 me-4 mb-4">
                <div class="row no-gutters">
                  
                  <div id="img1div" class="col-md-4">
                    <img id='img1' src={bugIcon} class="card-img ps-3" alt="Bug Icon"></img>
                  </div>

                  <div id="cardBodyDiv" class="col-md-8 ps-3 pe-3 pt-1">

                    <div className="card-body mt-3">
                      <h3>Reported Bug No. 006</h3>
                      <h4>Title: <b>Test Update Title 06</b></h4><br/>
                      <p>Assigned To: {obj1.assignedToUserName}</p>
                      <p>Classification: {obj1.classification}</p>
                      <p>Description: {obj1.description}</p>
                      <p>Reproduction Steps: {obj1.reproductionSteps}</p>
                      <p>bugID: {obj1._id}</p>
                    </div>
                  </div>
                </div>

                </div>

              
             </div>
             </div>
    }

    const root = ReactDOM.createRoot(document.getElementById('root')); 

    if (obj1) {

      console.log(obj1.title);
      root.render(<div><RenderNavbar /><h1 className='text-primary mt-2 mb-2'>Latest Bug List</h1><RenderCard /></div>)
      
    }

}

export default LoadBugList