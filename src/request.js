const address = 'http://194.67.87.25:443/';// 'http://localhost:8000/';//

export async function sendRequest(address) {
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
  export async function listFromResult(result)
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
  
  export async function fetchHistory(setHistory)
  {
    var result = await sendRequest(address + 'queue?cmd=get_history');
    if(result == null)
      return;
      
    var list = await listFromResult(result);
    list = list.reverse();
    console.log(list);
    setHistory(list);
  }
  
  
  export async function getStundentsList()
  {
    var result = await sendRequest(address + 'queue?cmd=get_list');
    if(result == null)
      return;
      
    return listFromResult(result);
  }
  
  export async function shuffleStundentsList()
  {
    var result = await sendRequest(address + 'queue?cmd=mix');
    if(result == null)
      return;
      
    return listFromResult(result);
  }
  export async function MoveStundentSetList(uid, setStudents)
  {
    var result = await sendRequest(address + 'queue?cmd=move&uid=' + uid);
    if(result == null)
      return;
    
    var list = await listFromResult(result);
    setStudents(list);
  }
  export async function IncStundentSetList(uid, setStudents, inc)
  {
    var result = await sendRequest(address + 'queue?cmd=change_priority&uid=' + uid+'&inc=' + inc);
    if(result == null)
      return;
    
    var list = await listFromResult(result);
    setStudents(list);
  }
  
  export async function setStudentsAsync(getter, setStudents) 
  {
    var list = await getter()
    setStudents(list);
  }

  export function getTeacherName(id)
  {
    return id == 0? 'Alexandr': 'Pert'
  }
  