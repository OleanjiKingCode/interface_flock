import type { NextApiRequest, NextApiResponse } from 'next';
import {getRewardAllowedMap, getRewardLimitMap} from "@/src/repositories/rewards";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    res.status(200).json(getRewardLimitMap());
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
