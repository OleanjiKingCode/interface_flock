import prisma from '@/src/lib/prisma';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const { userWallet, contributionId } = req.query;

    if (typeof contributionId !== 'string') {
      return res.status(400).json({ error: 'Invalid contribution id' });
    }

    if (typeof userWallet !== 'string') {
      return res.status(400).json({ error: 'Invalid user id' });
    }

    const userUpvoted = await prisma.dataContributionUpvote.findFirst({
      where: {
        dataContributionId: contributionId,
        wallet: userWallet,
      },
    });

    const userDownvoted = await prisma.dataContributionDownvote.findFirst({
      where: {
        dataContributionId: contributionId,
        wallet: userWallet,
      },
    });

    res
      .status(200)
      .json({
        upvoted: userUpvoted !== null,
        downvoted: userDownvoted !== null,
      });
  } catch (error) {
    res.status(500).json({ error: 'Internal server error' });
  }
}
