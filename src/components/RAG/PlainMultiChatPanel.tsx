import {useEffect, useState, KeyboardEvent, useRef, MouseEvent} from 'react';
import {Model} from "@prisma/client";
import styles from './MultiChatPanel.module.css'
import {v4 as uuidv4} from "uuid";
import {PrimaryButton} from "@/src/components";
import {useAccount} from "wagmi";

interface PlainMultiChatPanelProps{
  model:Model
}


const PlainMultiChatPanel = ({model}:PlainMultiChatPanelProps) => {
  const { address } = useAccount();
  const panelRef=useRef<HTMLDivElement>(null)
  const [question,setQuestion]=useState<string>('')
  const [questions,setQuestions]=useState<string[]>([])
  const [answers,setAnswers]=useState<string[]>([])
  const [loading,setLoading]=useState(false)
  const [sessionId,setSessionId]=useState<string>()
  const [votes,setVotes]=useState<number[]>([])

  const getVote=(index:number)=>{
    return votes?.length>=index+1?votes[index]:0
  }


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
      const index=questions.length
      setQuestions([...questions,question])
      setQuestion("")
      await getAnswer(question,index)
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

  const voteUp=async (index:number)=>{
    votes[index]=1
    setVotes([...votes])
    await vote(index,1)
  }

  const voteDown=async (index:number)=>{
    votes[index]=-1
    setVotes([...votes])
    await vote(index,-1)
  }

  const vote=async(index:number,vote:number)=>{
    await fetch(`/api/rag/voteChat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        sessionId,
        index,
        vote,
      }),
    });
  }

  const getChats=async ()=>{
    setLoading(true)
    try{
      const response=await fetch(`/api/rag/getChats?modelId=${model.id}&userId=${address}`);
      const result=await response.json()
      const {found,chats}=result
      if(found){
        setSessionId(chats[0].sessionId)
        setQuestions(chats.map((chat:any)=>chat.question))
        setAnswers(chats.map((chat:any)=>chat.answer))
        setVotes(chats.map((chat:any)=>chat.vote))
      }else{
        setSessionId(uuidv4())
      }
      setLoading(false)
    }catch (e) {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(model){
      getChats().then()
    }
  }, [model]);

  const getAnswer=async (question:string,index:number)=>{
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
          sessionId,
          index,
          userId:address,
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
  return <div className="flex flex-col flex-grow w-full rounded-lg mr-16 overflow-visible">
    <p className="text-xl font-semibold pb-6 pl-4 -mt-8 w-fit">Chat</p>
    <div className="flex flex-col space-y-4 flex-grow h-0 p-4 overflow-auto -mt-6" ref={panelRef}>
      <div className="flex w-full mt-2 space-x-3 items-start">
        <img className={'rounded-full h-8 w-8 border border-zinc-700'} src={model.modelIcon!} alt={''} />
        <div className="pl-2 rounded-l-lg rounded-br-lg flex flex-col items-start justify-start">
          <div className="text-sm font-bold">{model.modelName}</div>
          <p className="text-sm">Welcome! I am Model <span className={'font-medium'}>{model.modelName}</span>, Got burning questions? You're in luck! You have the power to ask three intriguing questions.</p>
        </div>
      </div>
      {questions.map((q,i)=>{
        return <>
          <div className="flex w-full mt-2 space-x-3  ml-auto items-start">
            <img className={'rounded-full h-8 w-8 border border-zinc-700'} src={"/chat-me.png"} alt="icon" />
            <div className="pl-2 rounded-l-lg rounded-br-lg flex flex-col items-start justify-start">
              <div className="text-sm font-bold">You</div>
              <p className="text-sm">{q}</p>
            </div>
          </div>
          { answers.length>i &&
            <div className="flex w-full mt-2 space-x-3 items-start">
              <img className={'rounded-full h-8 w-8 border border-zinc-700'} src={model.modelIcon!} alt={''} />
              <div className="pl-2 rounded-l-lg rounded-br-lg flex flex-col items-start justify-start">
                <div className="text-sm font-bold">{model.modelName}</div>
                <p className="text-sm">{answers[i]}</p>
                <div className="flex gap-2 -ml-0 m-2 space-x-2">
                  <svg onClick={()=>voteUp(i)} className={`${getVote(i)===1&&'text-green-600 fill-green-200'}  w-5 h-5 hover:text-green-600 hover:scale-110 cursor-pointer`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z"></path>
                  </svg>
                  <svg onClick={()=>voteDown(i)} className={`${getVote(i)===-1&&'text-red-600 fill-red-200'}  w-5 h-5 hover:text-red-600 hover:scale-110 cursor-pointer`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053c-.472 0-.745-.556-.5-.96a8.95 8.95 0 00.303-.54m.023-8.25H16.48a4.5 4.5 0 01-1.423-.23l-3.114-1.04a4.5 4.5 0 00-1.423-.23H6.504c-.618 0-1.217.247-1.605.729A11.95 11.95 0 002.25 12c0 .434.023.863.068 1.285C2.427 14.306 3.346 15 4.372 15h3.126c.618 0 .991.724.725 1.282A7.471 7.471 0 007.5 19.5a2.25 2.25 0 002.25 2.25.75.75 0 00.75-.75v-.633c0-.573.11-1.14.322-1.672.304-.76.93-1.33 1.653-1.715a9.04 9.04 0 002.86-2.4c.498-.634 1.226-1.08 2.032-1.08h.384"></path>
                  </svg>
                </div>
              </div>
            </div>
          }
        </>
      })}
      {loading &&  <div className="flex w-full mt-2 space-x-3 max-w-xs" >
        <div>
          <div className="p-3 rounded-r-lg rounded-bl-lg">
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
      {answers.length>=10 && <div className="flex w-full mt-2 space-x-3 items-start">
        <img className={'rounded-full h-12 min-w-12 border border-zinc-700'} src={model.modelIcon!} alt={''} />
        <div className="pl-2 rounded-l-lg rounded-br-lg flex flex-col items-start justify-start">
          <div className="text-lg font-bold">{model.modelName}</div>
          <p className="text">You have reached the limit of 10 questions for this model.</p>
        </div>
      </div>
      }
    </div>
    {answers.length<10 &&<div className="p-4 flex flex-col items-end bg-white rounded-2xl border border-zinc-800">
      <textarea rows={3} style={{boxShadow:'none !important'}} className="flex items-center w-full h-16 rounded px-3 border-none focus:outline-0 focus:outline-transparent focus:outline-offset-0 shadow-none" placeholder="Type your message…" value={question} onChange={e=>setQuestion(e.target.value)} onKeyDown={handleKeyboardEvent}/>
      <PrimaryButton
        disabled={loading}
        onClick={handleSendButton}
        margin={{ top: 'xsmall' }}
        label="Generate"
        size="medium"
        pad={{ vertical: 'xsmall', horizontal: 'medium' }}
      />
    </div>}
  </div>
};

export default PlainMultiChatPanel;