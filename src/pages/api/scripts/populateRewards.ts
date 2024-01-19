import type { NextApiRequest, NextApiResponse } from 'next';
import {populateRewards} from "@/src/scripts/populate_rewards";

type Data = {
    message:string
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await populateRewards()
  res.status(200).json({ message: 'Rewards populated' });
}