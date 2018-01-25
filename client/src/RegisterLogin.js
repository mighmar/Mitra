import React, { Component } from 'react';

import './RegisterLogin.css';
///import App from './App'

export default class RegisterLogin extends React.Component {
  constructor(props){
    super(props);
    this.state = { loggedIn: false, statusMessage:"",
	               visibleForm:["register-form-visible", "login-form"] };
    this.switchForms=this.switchForms.bind(this);
    this.registerAction=this.registerAction.bind(this);
    this.loginAction=this.loginAction.bind(this);
  }

  switchForms(p) {
	if(p === 'reg')
		  this.setState({ visibleForm:["register-form", "login-form-visible"] });
	else
		  this.setState({ visibleForm:["register-form-visible", "login-form"] });
  }

  registerAction(event) {
	  event.preventDefault();
	  let reqParams = {
		  headers : {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
		  },
		  method:'POST',
		  body: JSON.stringify({ username:this.refs.regName.value,
		                         password:this.refs.regPass.value, 
								 email:this.refs.regEmail.value }),
	  }
	  console.log(this.refs.regName.value);
	  console.log(this.refs.regPass.value);
	  fetch('http://localhost:3001/register', reqParams)
	  .then(response => { return response.json(); })
	  .then(text => {
		  let resp = JSON.parse(text);
		  if(resp.registerStatus === "registerSuccess") {
			  let msg = "Registration successful";
              let frm = ["register-form", "login-form-visible"];
			  this.setState({ statusMessage:msg, visibleForm:frm });
			  console.log(JSON.stringify(this.state));
		  }
		  else if(resp.registerStatus === "registerError") {
			  let msg = "Username already exists";
			  this.setState({ statusMessage:msg });
		  }
	  })
  }

  loginAction(event) {
	  event.preventDefault();
	  let reqParams = {
		  headers : {
			  'Accept': 'application/json',
			  'Content-Type': 'application/json'
		  },
		  method:'POST',
		  body: JSON.stringify({ username:this.refs.logName.value,
		  						 password:this.refs.logPass.value }),
	  }
	  console.log(this.refs.logName.value);
	  console.log(this.refs.logPass.value);
	  fetch('http://localhost:3001/login', reqParams)
	  .then(response => { return response.json(); })
	  .then(text => {
		  let resp = JSON.parse(text);
		  if(resp.loginStatus === "loginSuccess") {
			  this.setState({ loggedIn: true });
		  }
		  else if(resp.loginStatus === "loginError") {
			  let msg = "Error attempting to log in";
			  this.setState({ statusMessage:msg });
		  }
	  })
	  .catch(err => {
		  let { frm } = this.state.visibleForm;
		  let msg = "Invalid username and/or password";
		  this.setState({loggedIn: false, statusMessage:msg, frm});
	  });
  }

  render() {
	if(this.state.loggedIn == false)
    return (
	<div className="login-page">
	<p className="statusMessage"> {this.state.statusMessage} </p>
  <div className="form">
    <form className={this.state.visibleForm[0]} onSubmit={this.registerAction}>
      <input type="text" placeholder="name" ref="regName"/>
      <input type="password" placeholder="password" ref="regPass" />
      <input type="text" placeholder="email address" ref="regEmail" />
      <button type="submit" >create</button>
      <p className="message">Already registered?
        <a href="javascript:void(0)" onClick={() => this.switchForms('reg')}>Sign In</a></p>
    </form>
    <form className={this.state.visibleForm[1]} onSubmit={this.loginAction}>
      <input type="text" placeholder="username" ref="logName" />
      <input type="password" placeholder="password" ref="logPass" />
      <button type="submit" >login</button>
      <p className="message">Not registered?
      <a href="javascript:void(0)" onClick={() => this.switchForms('log')}>Create an account</a></p>
    </form>
  </div>
</div>
    );
	else
		return ("");
  }
}


