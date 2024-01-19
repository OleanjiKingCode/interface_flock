'use client'
import {useEffect, useState} from "react";
import {useAccount} from "wagmi";
import useEventListener from "@/src/hooks/useEventListener";
import {NOTIFICATION_TYPE_REWARD_UPDATED} from "@/src/constants/notificationTypes";

const MyPoint = () => {
  const {address}=useAccount()
  const [points,setPoints] = useState(0)
  const [showPoints,setShowPoints] = useState(false)
  const [localWindow,setWindow]=useState<Window>()
  useEffect(() => {
    if(window){
      setWindow(window)
    }
  }, []);

  const getPoints = async ()=>{
    try{
      const response=await fetch(`/api/rag/getMyPoints?wallet=${address?.toLowerCase()}`)
      const result=await response.json()
      setPoints(result.totalRewardAmount)
    }catch (e) {
      console.log(e)
    }
  }
  const handleEvent = (data: any) => {
    getPoints().then()
  };
  useEventListener(NOTIFICATION_TYPE_REWARD_UPDATED, handleEvent,localWindow);

  const handlePointsClick = () => { location.href = `${window.location.origin}/cocreation?showMyModels=1` }
  useEffect(()=>{
    getPoints().then()
  })
  useEffect(() => {
    setShowPoints(!!address)
  }, [address]);
  return showPoints?<div style={{boxShadow:'rgb(0, 0, 0) 4px 4px 0px 0px'}} onClick={() => handlePointsClick()} className={'flex flex-col p-8 border border-black rounded-2xl shadow-2xl w-[300px] space-y-3 h-fit cursor-pointer'}>
      <div className={'flex flex-row items-center space-x-1'}><svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M9.5 22.0605H15.5C20.5 22.0605 22.5 20.0605 22.5 15.0605V9.06055C22.5 4.06055 20.5 2.06055 15.5 2.06055H9.5C4.5 2.06055 2.5 4.06055 2.5 9.06055V15.0605C2.5 20.0605 4.5 22.0605 9.5 22.0605Z" fill="#6C93EC" stroke="#292D32" stroke-width="1.2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M7.37988 18.2106V16.1406" stroke="#292D32" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M12.5 18.2103V14.0703" stroke="#292D32" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M17.6201 18.2102V11.9902" stroke="#292D32" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M17.6199 5.91016L17.1599 6.45016C14.6099 9.43016 11.1899 11.5402 7.37988 12.4902" stroke="#292D32" strokeWidth="1.2" strokeLinecap="round"/>
        <path d="M14.6904 5.91016H17.6204V8.83016" stroke="#292D32" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
        <span className={'text-base font-medium'}>My total points</span></div>
      <div className={'flex flex-row items-center space-x-2'}>
        <div className={'text-4xl font-bold'}>{points}</div>
      </div>
      <div className={'flex flex-row items-center text-sm pt-4'}>Check your points history here<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.67 13.0605L13.09 16.6505L14.5 18.0605L20.5 12.0605L14.5 6.06055L13.09 7.47055L16.67 11.0605L4.5 11.0605L4.5 13.0605L16.67 13.0605Z" fill="#879095"/>
      </svg>
      </div>
    </div>:<></>
};

export default MyPoint;