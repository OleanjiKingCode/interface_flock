import prisma from '@/src/lib/prisma';
import {ModelChat } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import {insertReward, RewardType} from "@/src/repositories/rewards";
import {getUserIdFromWallet} from "@/src/repositories/users";

type ResponseData = {
  message: string;
  chat?: ModelChat | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { modelId, question, answer,sessionId,index,userId:wallet } = req.body;

  try {
    const newModelChat = await prisma.modelChat.create({
      data: {
        modelId,
        question,
        answer,
        sessionId,
        userId:wallet.toLowerCase(),
        index,
      },
    });
    const userId=await getUserIdFromWallet(wallet)
    if(userId){
      await insertReward(userId,RewardType.Chat)
    }else{
      console.error("Wallet not found")
    }
    res
      .status(200)
      .json({ message: 'ModelChat added to DB successfully', chat: newModelChat });
  } catch (error) {
    console.error('Error adding the modelChat:', error);
    return res.status(500).json({ message: 'Error adding the modelChat.' });
  }
}
