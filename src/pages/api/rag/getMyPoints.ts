import type { NextApiRequest, NextApiResponse } from 'next';
import { getUserReward} from "@/src/repositories/rewards";
import prisma from "@/src/lib/prisma";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const { wallet } = req.query;
  const user = await prisma.user.findUnique({
    where: {
      wallet: wallet as string,
    }
  });

  if(!user){
    res.status(500).json({error:'User not found'});
    return
  }
  res.status(200).json(await getUserReward(user.id));
}
