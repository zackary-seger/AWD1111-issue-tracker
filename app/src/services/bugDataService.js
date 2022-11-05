import React from 'react' 
import axios from "axios"; 
import mongoose from 'mongoose';

const { Schema } = mongoose;

const loginSchema = new Schema({
  email:  String,   // Here, String is shorthand for {type: String}
  password: String
});

class BugDataService extends React.Component{ 

  constructor(props, email, pass) {
    super(props);
    this.login = this.login.bind(this);
    this.email = email;
    this.pass = pass;
  }

  bugList(){ 
    return axios.get(`/api/bug/list`) 
  } 

  login(){ 

    let bodyFormData = new FormData();
    bodyFormData.append('email', this.email);
    bodyFormData.append('password', this.pass);
    let loginCreds = Object.fromEntries(bodyFormData.entries());

    // Create Schema Object Function: mongoose.model(modelName, schema)
    const loginCredModel = mongoose.model('loginCredModel', loginSchema);
    const credsObjModel = new loginCredModel();
    credsObjModel.insertMany(loginCreds, function(error, docs) {});

    return axios({
      method: "put",
      url: "api/user/login",
      data: loginCreds,
      headers: { "Content-Type": "multipart/form-data" },
    })
    .then(function (response) {
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

