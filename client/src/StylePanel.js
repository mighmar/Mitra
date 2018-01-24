import React from 'react';
import ReactTooltip from 'react-tooltip'
import { Link } from 'react-router-dom'
import logo from './Images/MitraHeader.png';
import './App.css';
import { CompactPicker } from 'react-color';
import Dropdown from 'react-dropdown'


class StylePanel extends React.Component {
    render() {
      const safeFonts = [
        { value: 'Arial', label: 'Arial' },
        { value: 'Helvetica', label: 'Helvetica' },
        { value: 'Times New Roman', label: 'Times New Roman' },
        { value: 'Times', label: 'Times' },
        { value: 'Courier New', label: 'Courier New' },
        { value: 'Courier', label: 'Courier' },
        { value: 'Verdana', label: 'Verdana' },
        { value: 'Georgia', label: 'Georgia' },
        { value: 'Palatino', label: 'Palatino' },
        { value: 'Garamond', label: 'Garamond' },
        { value: 'Bookman', label: 'Bookman' },
        { value: 'Comic Sans MS', label: 'Comic Sans MS' },
        { value: 'Trebuchet MS', label: 'Trebuchet MS' },
        { value: 'Arial Black', label: 'Arial Black' },
        { value: 'Impact', label: 'Impact' }
      ]
      const defaultFont = safeFonts[0]
      if(this.props.styleVisible){
          return         <div className="row stylePanel">
          <ReactTooltip />
          <div className="col-lg-1 col-lg-1 col-xl-1 stylePanelLabel">
          Cell background color:
          </div>
          <div className="col-lg-2 col-lg-2 col-xl-2" /*onClick={ ()=>{this.props.changePage("Dashboard")}}*/>
            <CompactPicker onChangeComplete={this.props.handleColorChange} />

          </div>
          <div className="col-lg-3 col-lg-3 col-xl-3" /*onClick={ ()=>{this.props.changePage("Dashboard")}}*/>
          <div className="row">
          <div className="col-lg-1 col-lg-1 col-xl-1 stylePanelLabel">
          Font:
          </div>
          <div className="col-lg-2 col-lg-2 col-xl-2 stylePanelFontDropdown">
          <Dropdown className='fontDropdown' onChange={this.props.handleFontChange} options={safeFonts}  value={defaultFont} placeholder="Select a font style" />
          </div>
          </div>
          </div>
            
        </div>;
      }else{
        return "";
      }
    }
  }

  export default StylePanel;
  
