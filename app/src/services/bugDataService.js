import React from 'react' 
import axios from "axios"; 
import validate from 'react-joi-validation';


class BugDataService extends React.Component{ 

  constructor(props, email, pass) {
    super(props);
    this.login = this.login.bind(this);
    this.email = email;
    this.pass = pass;
  }

  async bugList(){ 
    return await axios.get(`/api/bug/list`) 
  } 

  async login(props){ 

    return await axios({
      method: "put",
      url: "api/user/login",
      data: {email: `${this.email}`,
             password: `${this.pass}`},
      headers: { "Content-Type": "application/json" },
    }).catch(function (error) {
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        console.log(error.response.data);
        console.log(error.response.status);
        console.log(error.response.headers);
      } else if (error.request) {
        // The request was made but no response was received
        // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
        // http.ClientRequest in node.js
        console.log(error.request);
      } else {
        // Something happened in setting up the request that triggered an Error
        console.log('Error', error.message);
      }
      console.log(error.config);
    }).then(function (response) {
      //handle success
      console.log(response);
    })
    .catch(function (response) {
      //handle error
      console.log(response);
    });

  } 

  // get(id){ 
  //   return axios.get(`http://localhost:5000/api/v1/movies/id/${id}`) 
  // }  

  // find(query, by = "title", page = 0){ 
  //   return axios.get( `http://localhost:5000/api/v1/movies?${by}=${query}&page=${page}` ) 
  // }   

  // createReview(data){ 
  //   return axios.post("http://localhost:5000/api/v1/movies/review", data ) 
  // } 

  // updateReview(data){ 
  //   return axios.put("http://localhost:5000/api/v1/movies/review", data ) 
  // } 

  // deleteReview(id, userId){ 
  //   return axios.delete( "http://localhost:5000/api/v1/movies/review", { data:{ review_id: id, user_id: userId }} ) 
  // } 

  // getRatings(){ 
  //   return axios.get("http://localhost:5000/api/v1/movies/ratings") 
  // }    
  
} 
    
export default BugDataService

