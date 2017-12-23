import React from 'react';
import './App.css';
import GridRow from './GridRow';

  
const indexArray = function indexArray(len){
    let array = new Array(len);
    for (let i = 0; i < len; i++) {
            array[i]=i;
    }
    return array;
}

class GridContent extends React.Component {
    constructor(props){
        super(props);
        this.state={grid:{
            0:{
                0:0,
                1:1,
                2:2
            }
        }};


    }

    handleCellValueChange= (i,j,event)=>{
        let key = event.target.id;
        //provera da li je dozvoljena promena (poziv servera) 
        this.setState({i:{j:event.target.innerHTML}});
        alert(JSON.stringify(this.state, null, 4));

    }

    

    /*cell = <td className="defaultCell"><div  contentEditable></div> </td>;
    rowCells =fillArray(this.cell,100);
    tableRow = <tr> {this.rowCells} </tr>;
    wholeTable = fillArray(this.tableRow,100);

    wholeTableTest = indexArray(100).map(i=>{
        return <tr>{indexArray(100).map(j=>{
            return <td className="defaultCell">
            <div id={i+"-"+j} suppressContentEditableWarning={true} contentEditable onInput={this.handleCellValueChange}>
            </div> </td>
        }) } </tr>;
    });*/
    rowsArrayIndex = indexArray(40);

    render() {
        if(this.props.page=="Grid"){
            return         (
            <div className="row ">
                <div className="col-lg-1 col-lg-1 col-xl-1 gridToolbar" >
                    <div className="row">
                        <div className="col-lg-1 col-lg-1 col-xl-1" >
                            <div className="btnSplit"></div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-1 col-lg-1 col-xl-1" >
                            <div className="btnMerge"></div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-1 col-lg-1 col-xl-1" >
                            <div className="btnFunction"></div>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-1 col-lg-1 col-xl-1" >
                            <div className="btnPaint"></div>
                        </div>
                    </div>
                </div>
                <div className="col-lg-10 col-lg-10 col-xl-10 gridPanel" >
                    <table>
                        {this.rowsArrayIndex.map(index=>{
                        return <GridRow rowid={index} cellChangeHandler={this.handleCellValueChange} rowValues={this.state.grid[index]}/>
                    })
                        }
                    </table>
                </div>
                
            </div>)
      }else{
          return ("");
      }
         
    }
  }

  export default GridContent;
  
