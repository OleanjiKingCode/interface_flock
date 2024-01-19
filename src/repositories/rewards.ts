import prisma from '@/src/lib/prisma';
import {UserReward,UserModelReward } from '@prisma/client';
import { CourierClient } from '@trycourier/courier';
import {
  NOTIFICATION_TYPE_REWARD_UPDATED,
} from '@/src/constants/notificationTypes';
const courier = new CourierClient({
  authorizationToken: process.env.PUBLIC_COURIER_API_KEY,
});
export enum RewardType{
  ModelCreation='ModelCreation',
  ModelContribution='ModelContribution',
  Vote='Vote',
  Chat= 'Chat',
  WalletConnect='WalletConnect',
  DiscordConnect='DiscordConnect',
  TwitterFollow='TwitterFollow',
  TwitterShare='TwitterShare',
  DiscordJoinGetRole='DiscordJoinGetRole',
  TwitterConnect='TwitterConnect',
  ClaimReward='ClaimReward',
  TelegramConnect='TelegramConnect',
  TelegramJoin='TelegramJoin',
}

export const getRewardLimitMap=()=>{
  // Time in days
  return {
    [RewardType.ModelCreation]:{
      limit:500,
      time: 30
    },
    [RewardType.ModelContribution]:{
      limit:100,
      time: 1
    },
    [RewardType.Vote]:{
      limit:50,
      time: 1
    },
    [RewardType.Chat]:{
      limit:100,
      time: 1
    },
    [RewardType.WalletConnect]:{
      limit:30,
      time: -1
    },
    [RewardType.DiscordConnect]:{
      limit:30,
      time: -1
    },
    [RewardType.TwitterFollow]:{
      limit:30,
      time: -1
    },
    [RewardType.TwitterShare]:{
      limit:30,
      time: -1
    },
    [RewardType.DiscordJoinGetRole]:{
      limit:30,
      time: -1
    },
    [RewardType.TwitterConnect]:{
      limit:30,
      time: -1
    },
    [RewardType.TelegramJoin]:{
      limit:30,
      time: -1
    },
    [RewardType.TelegramConnect]:{
      limit:30,
      time: -1
    },
  }
}
export const getRewardMap=()=>{
  return {
    [RewardType.ModelCreation]:100,
    [RewardType.ModelContribution]:10,
    [RewardType.Vote]:10,
    [RewardType.Chat]:10,
    [RewardType.WalletConnect]:30,
    [RewardType.DiscordConnect]:30,
    [RewardType.TwitterFollow]:30,
    [RewardType.TwitterShare]:30,
    [RewardType.DiscordJoinGetRole]:30,
    [RewardType.TwitterConnect]:30,
    [RewardType.ClaimReward]:30,
    [RewardType.TelegramJoin]:30,
    [RewardType.TelegramConnect]:30,
  }
}
export const getRewardAmount=(rewardType:RewardType)=>{
  return getRewardMap()[rewardType]
}

export const getRewardKey=(rewardType:RewardType)=>{
  switch(rewardType){
    case RewardType.ModelCreation:
      return 'modelCreation'
    case RewardType.ModelContribution:
      return 'contribution'
    case RewardType.Vote:
      return 'vote'
    case RewardType.Chat:
      return 'chat'
    default:
      return 'others'
  }
}

export const getUserReward=async (userId:string)=>{
  return await prisma.userReward.findUnique({
    where:{
      userId
    }
  }) as UserReward|undefined
}


export const getUserRewardForModel=async (userId:string,modelId:string,take:number,skip:number)=>{
  return await prisma.userModelReward.findUnique({
    where:{
      userId_modelId: {
        userId,
        modelId
      }
    }
  }) as UserModelReward|undefined
}

export const getUserRewards=async (take=10,skip=0)=>{
  const userRewards:UserReward[]=await prisma.userReward.findMany({
    orderBy:{
      totalRewardAmount:'desc'
    },
    take,
    skip,
    include:{
      user:true
    },
  })
  return userRewards
}

export const getUserRewardsByModel=async (modelId:string,take=10,skip=0)=>{
  const userModelRewards:UserModelReward[]=await prisma.userModelReward.findMany({
    orderBy:{
      totalRewardAmount:'desc'
    },
    where:{
      modelId
    },
    include:{
      user:true
    },
    take,
    skip,
  })
  return userModelRewards
}

export const getRewardAllowedMap=async (userId:string)=>{
  return {
    [RewardType.ModelCreation]:await additionalRewardAllowed(userId,RewardType.ModelCreation),
    [RewardType.ModelContribution]:await additionalRewardAllowed(userId,RewardType.ModelContribution),
    [RewardType.Vote]:await additionalRewardAllowed(userId,RewardType.Vote),
    [RewardType.Chat]:await additionalRewardAllowed(userId,RewardType.Chat),
    [RewardType.WalletConnect]:await additionalRewardAllowed(userId,RewardType.WalletConnect),
    [RewardType.DiscordConnect]:await additionalRewardAllowed(userId,RewardType.DiscordConnect),
    [RewardType.TwitterFollow]:await additionalRewardAllowed(userId,RewardType.TwitterFollow),
    [RewardType.TwitterShare]:await additionalRewardAllowed(userId,RewardType.TwitterShare),
    [RewardType.DiscordJoinGetRole]:await additionalRewardAllowed(userId,RewardType.DiscordJoinGetRole),
    [RewardType.TwitterConnect]:await additionalRewardAllowed(userId,RewardType.TwitterConnect),
    [RewardType.TelegramJoin]: await additionalRewardAllowed(userId,RewardType.TelegramJoin),
    [RewardType.TelegramConnect]: await additionalRewardAllowed(userId,RewardType.TelegramConnect),
  }
}

export const getAllRewardAllowedMap=async ()=>{
  return {
    [RewardType.ModelCreation]:true,
    [RewardType.ModelContribution]:true,
    [RewardType.Vote]:true,
    [RewardType.Chat]:true,
    [RewardType.WalletConnect]:true,
    [RewardType.DiscordConnect]:true,
    [RewardType.TwitterFollow]:true,
    [RewardType.TwitterShare]:true,
    [RewardType.DiscordJoinGetRole]:true,
    [RewardType.TwitterConnect]:true,
    [RewardType.TelegramJoin]: true,
    [RewardType.TelegramConnect]: true,
  }
}

export const additionalRewardAllowed=async (userId:string,rewardType:RewardType)=>{
  const rewardLimitMap=getRewardLimitMap() as any
  const {limit,time}=rewardLimitMap[rewardType]
  if(time===-1){
    const count=await prisma.userModelRewardAudit.count({
      where: {
        userId,
        type:rewardType,
      }
    });
    return count===0
  }
  const result=await prisma.userModelRewardAudit.aggregate({
    _sum:{
     rewardAmount:true,
    },
    where: {
      userId,
      type:rewardType,
      createdAt:{
        gt:new Date(new Date().getTime()-time*24*3600*1000)
      }
    },
  });
  const sumOfReward=result._sum.rewardAmount||0
  return sumOfReward<limit
}

export const insertReward=async (userId:string,rewardType:RewardType,modelId?:string,contributionId?:string,createdAt:Date=new Date())=>{
  if(!await additionalRewardAllowed(userId,rewardType)){
    return
  }
  const key=getRewardKey(rewardType)
  const rewardAmount=getRewardAmount(rewardType)
  const transactions=[prisma.userModelRewardAudit.create({
    data:{
      userId,
      type:rewardType,
      rewardAmount,
      modelId,
      contributionId,
      createdAt
    }
  }),prisma.userReward.upsert({
    where:{
      userId
    },
    update:{
      [key]:{
        increment:rewardAmount
      },
      totalRewardAmount:{
        increment:rewardAmount
      }
    },
    create:{
      userId,
      [key]:rewardAmount,
      totalRewardAmount:rewardAmount,
      createdAt
    }
  })]

  if(modelId){
    transactions.push(prisma.userModelReward.upsert({
      where:{
        userId_modelId:{
          userId,
          modelId
        },
      },
      update:{
        [key]:{
          increment: rewardAmount
        },
        totalRewardAmount:{
          increment:rewardAmount
        }
      },
      create:{
        userId,
        modelId,
        [key]:rewardAmount,
        totalRewardAmount:rewardAmount,
        createdAt
      }
    }))
  }
  await prisma.$transaction(transactions)
  await notifyUser(userId,rewardAmount)
}
const notifyUser=async (userId:string,rewardAmount:number)=>{
  const user = await prisma.user.findUnique({
    where: {
      id: userId,
    },
  });
  console.log(user?.wallet,NOTIFICATION_TYPE_REWARD_UPDATED)
  await courier.send({
    message: {
      to: {
        user_id: user?.wallet,
      },
      template: 'NMF31NESR646WKG8NS9XXJDFXXY7',
      data: {
        notificationType: NOTIFICATION_TYPE_REWARD_UPDATED,
        rewardAmount,
      },
    },
  });
}

