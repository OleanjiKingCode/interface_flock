import prisma from '@/src/lib/prisma';
import {ModelChat } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  message: string;
  chat?: any | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const {sessionId,vote,index } = req.body;

  try {
    const votedChat = await prisma.modelChat.updateMany({
      data: {
        vote,
      },
      where:{
        sessionId,
        index
      }
    });
    res
      .status(200)
      .json({ message: 'ModelChat updated to DB successfully', chat: votedChat });
  } catch (error) {
    console.error('Error adding the modelChat:', error);
    return res.status(500).json({ message: 'Error voting the modelChat.' });
  }
}
