import * as React from "react";
import '../index.css';
import MyXYControlledModal from "./userListFilterModal";

function RenderLowerNavbar() {

  const buttonClicked = () => { return <MyXYControlledModal 
                                          onHide={e => e.stopPropagation()}
                                        />  
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
      <a onClick={buttonClicked()} id='bugListH2a' href='/bug/list'>
        <h2 id='bugListH202' className='text-primary mt-2 mb-4 me-2'>FILTER LIST ▼</h2>
      </a>
    </div>

   </div>

   );

}

export default RenderLowerNavbar;