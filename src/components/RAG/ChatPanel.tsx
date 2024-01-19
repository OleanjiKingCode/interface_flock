import {useEffect, useState} from 'react';

interface ChatPanelProps{
  modelId:string
}

const ChatPanel = ({modelId}:ChatPanelProps) => {
  const [question,setQuestion]=useState<string>()
  const [answer,setAnswer]=useState<string>()
  const [loading,setLoading]=useState(false)
  const getAnswer=async ()=>{
    setLoading(true)
    try{
      const response=await fetch(`/api/rag/getOneTimeAnswerFromModel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelId,
          question,
        }),
      });
      const result=await response.json()
      setAnswer(result.answer)
      setLoading(false)
    }catch (e) {
      setAnswer('Whoof! Some error happened, could you try another question or try again later!')
      setLoading(false)
    }
  }
  return <div className={'flex flex-col w-fit p-8 border border-zinc-600 rounded-2xl shadow-2xl w-[530px]'}>
    <div className={'flex flex-row items-center'}>
      <label className={'font-medium mr-4'}>Question:</label>
      <input className={'border border-gray-400 rounded-xl text-xl px-4'} type={'text'} onChange={e=>setQuestion(e.target.value)}/>
      <button onClick={getAnswer} className={'min-w-28 ml-4 font-medium text-zinc-700 bg-zinc-400 bg-opacity-50 rounded-full px-2 border border-zinc-800 hover:shadow-4xl hover:bg-zinc-700 hover:text-white'}>TRY OUT</button>
    </div>
    <div className={'border border-zinc-700 mt-4 min-h-96 bg-zinc-300 rounded-2xl p-4'}>
      {loading?'Loading the answers from model...':answer}
    </div>
  </div>
};

export default ChatPanel;