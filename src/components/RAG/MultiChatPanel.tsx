import {useEffect, useState, KeyboardEvent, useRef, MouseEvent} from 'react';
import {Model} from "@prisma/client";
import styles from './MultiChatPanel.module.css'

interface MultiChatPanelProps{
  model:Model
}

const MultiChatPanel = ({model}:MultiChatPanelProps) => {
  const panelRef=useRef<HTMLDivElement>(null)
  const [question,setQuestion]=useState<string>('')
  const [questions,setQuestions]=useState<string[]>([])
  const [answers,setAnswers]=useState<string[]>([])
  const [loading,setLoading]=useState(false)
  const combineQnA=(array1:string[],array2:string[])=>{
    let result=[]
    for(let i=0;i<array1.length;i++){
      result.push([array1[i],array2[i]])
    }
    return result
  }

  const handleSendButton = async(e: MouseEvent) => {
    await sendMessage()
  };

  const sendMessage=async ()=>{
    if ( question && !loading) {
      setQuestions([...questions,question])
      setQuestion("")
      await getAnswer(question)
    }
  }

  const handleKeyboardEvent= async (e:KeyboardEvent) => {
    if (e.key === 'Enter') {
      await sendMessage()
    }
  }

  useEffect(() => {
    panelRef.current!.scrollTop = panelRef.current!.scrollHeight;
  }, [loading,questions,answers]);

  const getAnswer=async (question:string)=>{
    setLoading(true)
    try{
      const response=await fetch(`/api/rag/getOneTimeAnswerFromModel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          modelId:model.id,
          question,
          chatHistory:combineQnA(questions,answers)
        }),
      });
      const result=await response.json()
      setAnswers([...answers,result.answer])
      setLoading(false)
    }catch (e) {
      setAnswers([...answers,'Whoof! Some error happened, could you try another question or try again later!'])
      setLoading(false)
    }
  }
  return <div className="flex flex-col flex-grow w-full max-w-xl bg-white shadow-xl rounded-lg overflow-hidden border-2 border-zinc-500">
    <div className="flex flex-col flex-grow h-0 p-4 overflow-auto" ref={panelRef}>
      <div className="flex w-full mt-2 space-x-3 max-w-xs">
        <div>
          <div className="bg-gray-500 text-zinc-100 p-3 rounded-r-lg rounded-bl-lg">
            <p className="text-sm">Welcome! I am Model <span className={'text-white font-medium'}>{model.modelName}</span>, Got burning questions? You're in luck! You have the power to ask three intriguing questions.</p>
          </div>
        </div>
      </div>
      {questions.map((q,i)=>{
        return <>
          <div className="flex w-full mt-2 space-x-3 max-w-xs ml-auto justify-end">
            <div>
              <div className="bg-blue-600 text-white p-3 rounded-l-lg rounded-br-lg">
                <p className="text-sm">{q}</p>
              </div>
            </div>
          </div>
          { answers.length>i &&
            <div className="flex w-full mt-2 space-x-3 max-w-xs">
              <div>
                <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
                  <p className="text-sm">{answers[i]}</p>
                </div>
              </div>
            </div>
          }
        </>
      })}
      {loading &&  <div className="flex w-full mt-2 space-x-3 max-w-xs" >
        <div>
          <div className="bg-gray-300 p-3 rounded-r-lg rounded-bl-lg">
            <p className="text-sm">
              <div className={`flex space-x-3 ${styles.loader}`}>
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce"></div>
              <div className="w-1.5 h-1.5 bg-gray-800 rounded-full animate-bounce"></div>
            </div></p>
          </div>
        </div>
      </div>
      }
      {answers.length>=10 &&  <div className="flex w-full mt-2 space-x-3 max-w-xs" >
        <div>
          <div className="bg-gray-500 text-zinc-100 p-3 rounded-r-lg rounded-bl-lg">
            <p className="text-sm">
              You have reached the limit of 10 questions within 24 hours for this model.</p>
          </div>
        </div>
      </div>
      }
    </div>
    {answers.length<3 &&<div className="bg-gray-300 p-4 flex flex-row items-center">
      <input className="flex focus:ring-zinc-600 focus:ring-1 focus:outline-none items-center h-10 w-full rounded px-3 text-sm" type="text" placeholder="Type your message…" value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={handleKeyboardEvent}/>
      {!loading && <button className={'p-2 border-2 border-zinc-500 ml-2 text-sm font-bold text-zinc-500 hover:bg-zinc-400 hover:text-white'} onClick={handleSendButton}>SEND</button>}
    </div>}
  </div>
};

export default MultiChatPanel;