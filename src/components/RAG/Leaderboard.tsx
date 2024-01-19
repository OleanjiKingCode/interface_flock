import {useEffect, useState} from 'react';
import {UserModelReward, UserReward} from "@prisma/client";
import {useAccount} from "wagmi";
import useEventListener from "@/src/hooks/useEventListener";
import {NOTIFICATION_TYPE_MODEL_VERIFIED, NOTIFICATION_TYPE_REWARD_UPDATED} from "@/src/constants/notificationTypes";

interface LeaderboardProps{
  modelId?:string
}

const Leaderboard = ({modelId}:LeaderboardProps) => {
  const { address } = useAccount();
  const [leaderboards,setLeaderboards]=useState<UserReward[]|UserModelReward[]>([])
  const [reward,setReward]=useState<UserModelReward|undefined>()
  const [rank,setRank]=useState<number>(0)
  const [loading,setLoading]=useState(false)
  const [localWindow,setWindow]=useState<Window>()

  useEffect(() => {
    if(window){
      setWindow(window)
    }
  }, []);
  const handleEvent = (data: any) => {
    getLeaderboard().then()
  };
  useEventListener(NOTIFICATION_TYPE_REWARD_UPDATED, handleEvent,localWindow);

  useEffect(() => {
    getLeaderboard().then()
  }, [address]);


  // function to take the first 4 letters of the string and 5 last letters of the string and cancatenate them with '...' in the center
  const truncateAddress = (str: string) => {
    return str.slice(0, 6) + '...' + str.slice(-5)
  }

  const getIconName=()=>{
    const NUMBER_OF_SVGS=25
    const index=Math.floor(Math.random()*NUMBER_OF_SVGS)
    return `/avatar${index+1}.png`
  }

  const getLeaderboard=async ()=>{
    setLoading(true)
    try{
      const response=await fetch(`/api/rag/getLeaderboard?modelId=`+(modelId||''))
      const result=await response.json()
      setLeaderboards(result)
      if(address){
        const rewards=result.find((item:any)=>item.user.wallet.toLowerCase()===address?.toLowerCase())
        const index=result.findIndex((item:any)=>item.user.wallet.toLowerCase()===address?.toLowerCase())
        setReward(rewards)
        setRank(index+1)
      }
      setLoading(false)
    }catch (e) {
      setLoading(false)
    }
  }



  return modelId?<div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left rtl:text-right border-separate bg-white" style={{borderSpacing:'0 0.5em', padding: '20px', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}>
      {!modelId && <caption className="text-2xl font-extrabold text-black text-left bg-white" style={{padding: '20px 30px 0 30px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px'}}>Leaderboard</caption>}
      <thead className="text-sm">
      <tr>
        <th scope="col" className="px-6 py-3">
          Rank
        </th>
        <th scope="col" className="px-6 py-3">
          User
        </th>
        <th scope="col" className="px-6 py-3">
          XP
        </th>
      </tr>
      </thead>
      <tbody>
      {
        address && <>{reward?<tr className="bg-blue-100">
          <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap rounded-l-2xl">
            {rank}
          </th>
          <td className="px-6 py-4">
            <img src={getIconName()} className={'w-6 h-6 rounded-full inline-block mr-2'}/>
            {truncateAddress((reward as any).user.wallet)}
          </td>
          <td className="px-6 py-4 rounded-r-2xl text-blue-600">
            {reward.totalRewardAmount}
          </td>
        </tr>:<tr className="bg-blue-100">
          <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap rounded-l-2xl">
            -
          </th>
          <td className="px-6 py-4">
            <img src={getIconName()} className={'w-6 h-6 rounded-full inline-block mr-2'}/>
            {truncateAddress(address!)}
          </td>
          <td className="px-6 py-4 rounded-r-2xl text-blue-600">
            0
          </td>
        </tr>}</>
      }
      {address && <tr></tr>}
      {address && <tr></tr>}
      {leaderboards.filter((l,index)=>index!==rank-1).map((leaderboard,index)=><tr className="bg-blue-100">
        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap rounded-l-2xl">
          {rank===0?index+1:(index>rank-2?index+2:index+1)}
        </th>
        <td className="px-6 py-4">
          <img src={getIconName()} className={'w-6 h-6 rounded-full inline-block mr-2'}/>
          {truncateAddress((leaderboard as any).user.wallet)}
        </td>
        <td className="px-6 py-4 rounded-r-2xl text-blue-600">
          {leaderboard.totalRewardAmount}
        </td>
      </tr>)}
      </tbody>
    </table>
  </div>:<div className="relative overflow-x-auto">
    <table className="w-full text-sm text-left rtl:text-right border-separate bg-white" style={{borderSpacing:'0 0.5em', padding: '20px', borderBottomLeftRadius: '30px', borderBottomRightRadius: '30px' }}>
    <caption className="text-2xl font-extrabold text-black text-left bg-white" style={{padding: '20px 30px 0 30px', borderTopLeftRadius: '30px', borderTopRightRadius: '30px'}}>Leaderboard</caption>
      <thead className="text-sm">
      <tr>
        <th scope="col" className="px-6 py-3">
          Rank
        </th>
        <th scope="col" className="px-6 py-3">
          User
        </th>
        <th scope="col" className="px-6 py-3">
          Socials
        </th>
        <th scope="col" className="px-6 py-3">
          Model Creation
        </th>
        <th scope="col" className="px-6 py-3">
          Knowledge Contribution
        </th>
        <th scope="col" className="px-6 py-3">
          Voting
        </th>
        <th scope="col" className="px-6 py-3">
          Chat
        </th>
        <th scope="col" className="px-6 py-3">
          Total Points
        </th>
      </tr>
      </thead>
      <tbody>
      {leaderboards.map((leaderboard,index)=><tr className="bg-[#F2F6FF]">
        <th scope="row" className="px-6 py-4 font-medium whitespace-nowrap rounded-l-2xl">
          {index+1}
        </th>
        <td className="px-6 py-4">
          <img src={getIconName()} className={'w-6 h-6 rounded-full inline-block mr-2'}/>
          {truncateAddress((leaderboard as any).user.wallet)}
        </td>
        <td className="px-6 py-4 text-[#6C93EB]">
          {leaderboard.others}
        </td>
        <td className="px-6 py-4 text-[#6C93EB]">
          {leaderboard.modelCreation}
        </td>
        <td className="px-6 py-4 text-[#6C93EB]">
          {leaderboard.contribution}
        </td>
        <td className="px-6 py-4 text-[#6C93EB]">
          {leaderboard.vote}
        </td>
        <td className="px-6 py-4 text-[#6C93EB]">
          {leaderboard.chat}
        </td>
        <td className="px-6 py-4 rounded-r-2xl text-[#6C93EB]">
          {leaderboard.totalRewardAmount}
        </td>
      </tr>)}
      </tbody>
    </table>
  </div>
};

export default Leaderboard;
