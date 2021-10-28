import HistoryItem from './history_item';

export default function History(params) {
    return (
        <div>
        <table className='CenterBlock HistoryBox' style={{height:'200px', overflowY:'scroll'}}>
          <tbody>
            {params.historyList.map(history => (
                  <tr><HistoryItem cmd = {history.cmd} time={history.time}/></tr>))}
          </tbody>
        </table>
      </div>
    );
}