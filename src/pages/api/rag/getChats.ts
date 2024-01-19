import prisma from '@/src/lib/prisma';
import {ModelChat } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';

type ResponseData = {
  found: boolean;
  chats?: ModelChat[] | null;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseData>
) {
  const { modelId,userId:wallet } = req.query;

  try {
    const allchats = await prisma.modelChat.findMany({
      where:{
        modelId:modelId?.toString(),
        userId:(wallet as string)?.toLowerCase(),
        createdAt:{
          gt:new Date(new Date().getTime()-24*3600*1000)
        }
      }
    });
    // get unique session of chats
    const uniqueSessionIds = new Set(allchats.map(item => item.sessionId))
    if(uniqueSessionIds.size){
      // @ts-ignore
      for(const sessionId of uniqueSessionIds){
        const chats=allchats.filter((item) => sessionId===item.sessionId)
        if(chats.length){
          res
            .status(200)
            .json({ found: true, chats: chats.sort((a,b)=>a.index-b.index) });
          return
        }
      }
    }
    res
      .status(200)
      .json({ found: false, chats: [] });
  } catch (error) {
    console.error('Error adding the modelChat:', error);
    return res.status(500).json({ found:false, chats: [] });
  }
}
