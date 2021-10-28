import React, { useState } from 'react';
import './App.css';
import './styles.css';

function HistoryItem(params)
{
  return (
    <tr >
      <td className='HistoryCmd'>{params.cmd}</td>
      <td style={{width:'50px'}}/>
      <td className='HistoryTime'>{params.time}</td>
    </tr>
  )
}

export default HistoryItem;