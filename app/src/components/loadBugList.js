import { finalArr } from './bugList';

const LoadBugList = props => { 

    return (
      <div>
        <div className="card bug">

          <img src="../images/img_avatar.png" alt="Avatar"></img>
          <div class="container">
            <h4><b>{finalArr['0']}</b></h4>
            <p>Found By: Zackary Seger</p>
          </div>

        </div>
      </div>  
    )


}

export default LoadBugList