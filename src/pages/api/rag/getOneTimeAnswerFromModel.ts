import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { S3Client,GetObjectCommand } from '@aws-sdk/client-s3';
import { NextApiRequest, NextApiResponse } from 'next';
import {LINK_FILE_SIGNATURE} from "@/src/constants/constants";
import prisma from "@/src/lib/prisma";

type GetOneTimeAnswerResponse = {
  answer?: string;
  chat?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetOneTimeAnswerResponse>
) {
  const { modelId,question,chatHistory,sessionId,index,userId } = req.body;
  const response=await fetch(`${process.env.ML_BACKEND_URL}/chat/conversational_rag_chat`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ML_BACKEND_API_KEY!
    },
    body: JSON.stringify({
      question:question,
      knowledge_source_id:modelId,
      chat_history:chatHistory,
    }),
  });
  const result=await response.json()
  const newModelChat = await prisma.modelChat.create({
    data: {
      modelId,
      userId:userId.toLowerCase(),
      question,
      answer:result.answer,
      sessionId,
      index,
    },
  });
  return res.status(200).json({...result,chat:newModelChat});
}
