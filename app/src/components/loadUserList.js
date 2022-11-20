import * as ReactDOM from 'react-dom';
import { finalArr } from './userList';
import RenderNavbar from './navbar';
import RenderLowerNavbar from './lowerNav';
import bugIcon from '../images/profileHeadshot100dpi.png'

import "../index.css"
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';



function LoadBugList() { 

    let obj1 = finalArr['0'];
    let role = obj1.role;

    if (role != null && role[1]){
      role = `${role[0]} && ${role[1]}`
    } else {
      role = role[0];
    }


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
                      <h3>User No. 001</h3>
                      <h4>Full Name: {obj1.firstName} {obj1.lastName}</h4><br/>
                      <p>Role: {role}</p>
                      <p>Email: {obj1.email}</p>
                      <p>Profile Creation Date: {obj1.createdDateTime}</p>
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
                    <h3>User No. 001</h3>
                      <h4>Full Name: {obj1.firstName} {obj1.lastName}</h4><br/>
                      <p>Role: {obj1.role}</p>
                      <p>Email: {obj1.email}</p>
                      <p>Profile Creation Date: {obj1.createdDateTime}</p>
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
                    <h3>User No. 001</h3>
                      <h4>Full Name: {obj1.firstName} {obj1.lastName}</h4><br/>
                      <p>Role: {obj1.role}</p>
                      <p>Email: {obj1.email}</p>
                      <p>Profile Creation Date: {obj1.createdDateTime}</p>
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
                    <h3>User No. 001</h3>
                      <h4>Full Name: {obj1.firstName} {obj1.lastName}</h4><br/>
                      <p>Role: {obj1.role}</p>
                      <p>Email: {obj1.email}</p>
                      <p>Profile Creation Date: {obj1.createdDateTime}</p>
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
                    <h3>User No. 001</h3>
                      <h4>Full Name: {obj1.firstName} {obj1.lastName}</h4><br/>
                      <p>Role: {obj1.role}</p>
                      <p>Email: {obj1.email}</p>
                      <p>Profile Creation Date: {obj1.createdDateTime}</p>
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
                      <h3>User No. 001</h3>
                      <h4>Full Name: {obj1.firstName} {obj1.lastName}</h4><br/>
                      <p>Role: {obj1.role}</p>
                      <p>Email: {obj1.email}</p>
                      <p>Profile Creation Date: {obj1.createdDateTime}</p>
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
      root.render(
        
      <div>

        <RenderNavbar />
        <RenderLowerNavbar />
        <RenderCard />
      
      </div>)
      
    }

}

export default LoadBugList