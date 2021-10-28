import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import './styles.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import './history_item'
import HistoryItem from './history_item';

const address ='http://194.67.87.25:443/';// 'http://localhost:8000/';//

async function sendRequest(address) {
  try 
  {
    const response = await fetch(address);

    if (!response.ok) 
    {
      console.log('Not ok response',response);
      return null;
    }

    return response;
  } 
  catch (error) 
  {
    console.log('Error caught', error);
    return null;
  }
}
async function listFromResult(result)
{
  const data = await result.json();

  var studentList = [];

  for(var i in data)
  {
    studentList.push(data[i]);
  }

  console.log(data);

  return studentList;
}

async function fetchHistory(setHistory)
{
  var result = await sendRequest(address + 'queue?cmd=get_history');
  if(result == null)
    return;
    
  var list = await listFromResult(result);
  list = list.reverse();
  console.log(list);
  setHistory(list);
}


async function getStundentsList()
{
  var result = await sendRequest(address + 'queue?cmd=get_list');
  if(result == null)
    return;
    
  return listFromResult(result);
}

async function shuffleStundentsList()
{
  var result = await sendRequest(address + 'queue?cmd=mix');
  if(result == null)
    return;
    
  return listFromResult(result);
}
async function MoveStundentSetList(uid, setStudents)
{
  var result = await sendRequest(address + 'queue?cmd=move&uid=' + uid);
  if(result == null)
    return;
  
  var list = await listFromResult(result);
  setStudents(list);
}

async function setStudentsAsync(getter, setStudents) 
{
  var list = await getter()
  setStudents(list);
}
function getTeacherName(id)
{
  return id == 0? 'Alexandr': 'Pert'
}

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

  var firstTeacher = studentsList.filter(x => x.teacher == 0);
  var secondTeacher = studentsList.filter(x => x.teacher == 1);
  
  return (
    <div className='CenterAll'>
      <div>
        <h1 className='CenterAll'>
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
      <table className='CenterBlock HistoryBox'>
        <tbody>
          {historyList.map(history => (
                <HistoryItem cmd = {history.cmd} time={history.time}/>))}
        </tbody>
      </table>

      </div>
    </div>
  );
}

ReactDOM.render(<MainPage/>, document.getElementById('root'));
