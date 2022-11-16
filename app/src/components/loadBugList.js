import { finalArr } from './bugList';

const LoadBugList = props => { 

    let obj1 = finalArr['0'];

    return (

        <div className="card">

          <img src="../images/img_avatar.png" alt="Avatar"></img>
          <div class="container">
            <h4><b>{obj1}</b></h4>
            <p>Found By: Zackary Seger</p>
          </div>

        </div>

    )


}

export default LoadBugList