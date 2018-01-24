import React, { Component } from 'react';
import Header from './Header';
import DashBoardContent from './DashboardContent';
import GridContent from './GridContent';
import ConfigurationContent from './ConfigurationContent';
import LoadExistingContent from './LoadExistingContent';
import ReactTooltip from 'react-tooltip'



import iconPlus from './Images/iconPlus.png';
import iconExisting from './Images/iconExisting.png';
import iconGear from './Images/iconGear.png';

import './App.css';
import { addUser } from './api';


class App extends Component {
  constructor(props){
    super(props);
    this.state={Page:"Dashboard"}
    this.changePageFunc=this.changePageFunc.bind(this);
    addUser();
  }

  changePageFunc(pageName){
      this.setState({Page:pageName});
  }

  render() {

    return (
     <div className="container-fluid">
        <Header page={this.state.Page} changePage={this.changePageFunc}/>
        <DashBoardContent  page={this.state.Page}/>
        <GridContent  page={this.state.Page}/>
        <LoadExistingContent page={this.state.Page} />
        <ConfigurationContent  page={this.state.Page}/>
        <ReactTooltip />

     </div>
    );
  }
}

export default App;
