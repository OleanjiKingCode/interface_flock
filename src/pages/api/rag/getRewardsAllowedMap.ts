import type { NextApiRequest, NextApiResponse } from 'next';
import {getAllRewardAllowedMap, getRewardAllowedMap} from "@/src/repositories/rewards";
import prisma from "@/src/lib/prisma";
import {User} from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userId } = req.query;
    const user = await prisma.user.findUnique({
      where: {
        wallet: userId as string,
      }
    }) as User;
    if(!user){
      res.status(200).json(await getAllRewardAllowedMap());
      return
    }
    res.status(200).json(await getRewardAllowedMap(user.id));
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
