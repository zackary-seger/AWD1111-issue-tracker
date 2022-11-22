import * as React from "react";
import '../index.css';
import MyXYControlledModal from "./userListFilterModal.js";

function RenderLowerNavbar() {

  const [modalShow, setModalShow] = React.useState(false);

  const ButtonClicked = (e) => {
                                  e.preventDefault();  
                                  console.log('Modal Attempts..');
                                  setModalShow(true);                                     
                               }

  return ( 

    <div id="lowerNav" className='container'>

    <h1 id='bugListH1' className='mt-2 mb-4 me-1'>ALL USERS</h1>

    <div className='d-inline-block lowerNavLink'>
      <a href='/bug/list'>
        <h2 id='bugListH201' className='text-primary mt-2 mb-4 me-2'>UPDATE LIST</h2>
      </a>
    </div>

    <div className='d-inline-block lowerNavLink'>
      <a onClick={(evt) => ButtonClicked(evt)} id='bugListH2a' href='/bug/list'>
        <h2 id='bugListH202' className='text-primary mt-2 mb-4 me-2'>FILTER LIST ▼</h2>
      </a>
    </div>

    <MyXYControlledModal show={modalShow} onHide={ e => { setModalShow(false); e.stopPropagation() } } />

   </div>

   );

}

export default RenderLowerNavbar