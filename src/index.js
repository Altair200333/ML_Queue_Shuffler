import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import './styles.css'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';


const address = 'http://194.67.87.25:443/';//http://localhost:8000/';

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

  const moveSelectedStudent = () => 
  {
    if(selectedStudent!='')
    {
      MoveStundentSetList(selectedStudent, setStudentsList);
    }
  }

  if (studentsList.length == 0)
  {
    setStudentsAsync(getStundentsList, setStudentsList);
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
                <tr><td ><Student data={student} setSelected = {setSelectedStudent} selected = {selectedStudent}/></td></tr>
              ))}
            </td>
            <td>
              <td><h1 className='CenterBlock TeacherName'>{getTeacherName(1)}</h1></td>
              {secondTeacher.map(student => (
                <tr><td><Student data={student}  setSelected = {setSelectedStudent} selected = {selectedStudent}/></td></tr>
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
            <button className='button1' onClick={()=>{setStudentsAsync(getStundentsList, setStudentsList);}}>
              Refresh list
            </button>
            <p/>
            <button className='button1' onClick={()=>{setStudentsAsync(shuffleStundentsList, setStudentsList);}}>
              Shuffle
            </button>
            </td>
          </tr>
        </tbody>
      </table>
      
      </div>
    </div>
  );
}

ReactDOM.render(<MainPage/>, document.getElementById('root'));
