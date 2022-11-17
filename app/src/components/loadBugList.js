import { finalArr } from './bugList';

let x = 0; // Save as state instead..

function LoadBugList() { 

    let obj1 = finalArr['0'];
    console.log(obj1);

    if (obj1.title){
      console.log(obj1.title);
    }

    if (x > 0) {
      return (

          <div className="card">

            <img src="../images/img_avatar.png" alt="Avatar"></img>
            <div class="container">
              <h4><b>{obj1.title}</b></h4>
              <p>Found By: Zackary Seger</p>
            </div>

          </div>

      )
    }

    x++;

}

export default LoadBugList