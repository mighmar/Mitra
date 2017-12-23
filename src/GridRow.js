import React from 'react';
import './App.css';

const indexArray = function indexArray(len){
    let array = new Array(len);
    for (let i = 0; i < len; i++) {
            array[i]=i;
    }
    return array;
}

class GridRow extends React.Component {
    constructor(props){
        super(props);
        this.state={};


    }
    handleCellValueChange= (event)=>{
        let key = event.target.id;
        //provera da li je dozvoljena promena (poziv servera)        
        this.setState({key:event.target.innerHTML});
    }
    arrayIndex = indexArray(20);
    render() {
        let renderValue=this.props.rowValues==undefined?{}:this.props.rowValues;
        return(<tr>
            {this.arrayIndex.map(el=>{
                return <td className="defaultCell">
                    <div id={el} suppressContentEditableWarning={true} contentEditable 
                    onInput={(e)=>{this.props.cellChangeHandler(this.props.rowid,el,e)}}>
                    {renderValue[el]==undefined?"":renderValue[el]}
                </div> </td>
            })}
        </tr>);
    }
  }

  export default GridRow;
  
