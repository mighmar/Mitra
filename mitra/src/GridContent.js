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
                1:"A", 2:"B",3:"C",4:"D",5:"E",6:"F",7:"G",8:"H",9:"I",10:"J",11:"K",
                12:"L",13:"M",14:"N",15:"O",16:"P",17:"Q",18:"R",19:"S",20:"T",21:"U",
                22:"V",23:"W",24:"X",25:"Y",26:"Z"
            },
            1:{0:1},2:{0:2},3:{0:3},4:{0:4},5:{0:5},6:{0:6},7:{0:7},8:{0:8},9:{0:9},10:{0:10},
            11:{0:11},12:{0:12},13:{0:13},14:{0:14},15:{0:15},16:{0:16},17:{0:17},18:{0:18},19:{0:19},
            20:{0:20},21:{0:21},22:{0:22},23:{0:23},24:{0:24},25:{0:25},26:{0:26},27:{0:27},28:{0:28},29:{0:29},
            30:{0:30},31:{0:31},32:{0:32},33:{0:33},34:{0:34},35:{0:35},36:{0:36},37:{0:37},38:{0:38},39:{0:39},40:{0:40}
        }};


    }

    handleCellValueChange= (i,j,event)=>{
        let key = event.target.id;
        //provera da li je dozvoljena promena (poziv servera) 
        this.setState({i:{j:event.target.innerHTML}});
        //alert(JSON.stringify(this.state, null, 4));
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
  
