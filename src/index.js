import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import './styles.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './history_item'
import {MoveStundentSetList, fetchHistory, setStudentsAsync, getStundentsList, shuffleStundentsList, getTeacherName, IncStundentSetList} from './request' 
import History from './history';

function Student(params)
{
  // {getTeacherName(params.data.teacher)}
  const [hower, setHower] = useState(false);

  return (
    <div className='CenterBlock' style={{width:'300px', height:'50px', backgroundColor:'transparent'}} 
    onMouseEnter ={() => {setHower(true)}} onMouseLeave={()=>{setHower(false)}} 
    onClick={()=>{params.setSelected(params.data.uid); console.log(params.data.uid);}}>

      <div className='StudentName CenterBlock'
        style={{width:'150px', height: hower?'34px':'20px', backgroundColor: params.data.uid == params.selected ? '#e4e3ff' : ''}}>
        {params.data.name}
        <div style={{width:'20px'}}/>
        <div style={{color:'#f21fd6'}}>{params.data.priority}</div>
      </div>
    </div>
  );
}

function MainPage(params) 
{
  const [studentsList, setStudentsList] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [historyList, setHistory] = useState([]);

  const selectStudentHandler = (uid) =>
  {
    if(uid == selectedStudent)
    {
      setSelectedStudent('');
    }
    else
    {
      setSelectedStudent(uid);
    }
  }

  const moveSelectedStudent = () => 
  {
    if(selectedStudent!='')
    {
      MoveStundentSetList(selectedStudent, setStudentsList);
      fetchHistory(setHistory);
    }
  }
  const incPriority=()=>
  {
    if(selectedStudent!='')
    {
      IncStundentSetList(selectedStudent, setStudentsList, '1');
      fetchHistory(setHistory);
    }
  }
  const DecPriority=()=>
  {
    if(selectedStudent!='')
    {
      IncStundentSetList(selectedStudent, setStudentsList, '-1');
      fetchHistory(setHistory);
    }
  }
  const refreshHandler = () =>
  {
    setStudentsAsync(getStundentsList, setStudentsList);
    fetchHistory(setHistory);
  }
  const shuffleStudentStudentsHandler = () =>
  {
    setStudentsAsync(shuffleStundentsList, setStudentsList);
    fetchHistory(setHistory);
  }

  if (studentsList.length == 0)
  {
    refreshHandler();
  }
  studentsList.sort(function(a, b) {
    return b.priority - a.priority;
  });
  var firstTeacher = studentsList.filter(x => x.teacher == 0);
  var secondTeacher = studentsList.filter(x => x.teacher == 1);
  
  return (
    <div className='CenterAll'>
      <div>
      <h1 className='CenterAll' style={{color:'#8d1ff2'}}>
        Queue
      </h1>

      <table className='CenterBlock'>
        <tbody>
          <tr>
            <td style={{width:'300px'}}>
              <td><h1 className='CenterBlock TeacherName'>{getTeacherName(0)}</h1></td>
              {firstTeacher.map(student => (
                <tr><td ><Student data={student} setSelected = {selectStudentHandler} selected = {selectedStudent}/></td></tr>
              ))}
            </td>
            <td>
              <td><h1 className='CenterBlock TeacherName'>{getTeacherName(1)}</h1></td>
              {secondTeacher.map(student => (
                <tr><td><Student data={student}  setSelected = {selectStudentHandler} selected = {selectedStudent}/></td></tr>
              ))}
            </td>
          </tr>
        </tbody>
      </table>
      <div style={{height:'50px'}}/>

      <table className='CenterBlock'>
        <tbody>
          <tr>
            <td>
              <button className='button1' onClick={moveSelectedStudent}>
                Switch teacher
              </button>
              <p/>
              <button className='button1' onClick={incPriority}>
                ++priority
              </button>
              <p/>
              <button className='button1' onClick={DecPriority}>
                --priority
              </button>
            </td>
            <td style={{width:'100px'}}/>
            <td>
            <button className='button1' onClick={()=>{refreshHandler();}}>
              Refresh list
            </button>
            <p/>
            <button className='button1' onClick={()=>{shuffleStudentStudentsHandler();}}>
              Shuffle
            </button>
            </td>
          </tr>
        </tbody>
      </table>
      <p/>
      <History historyList={historyList}/>
      
      </div>
    </div>
  );
}

ReactDOM.render(<MainPage/>, document.getElementById('root'));
