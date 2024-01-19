import type { NextApiRequest, NextApiResponse } from 'next';
import {getUserRewards, getUserRewardsByModel} from "@/src/repositories/rewards";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    let { modelId,take,skip } = req.query;
    take=take||'10'
    skip=skip||'0'
    if(modelId){
      res.status(200).json(await getUserRewardsByModel(modelId as string,parseInt(take as string),parseInt(skip as string)));
      return;
    }else{
      res.status(200).json(await getUserRewards(parseInt(take as string),parseInt(skip as string)));
      return;
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
