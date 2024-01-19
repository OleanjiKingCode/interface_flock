import prisma from '@/src/lib/prisma';
import { PrismaClient } from '@prisma/client';
import { NextApiRequest, NextApiResponse } from 'next';
import Client from 'twitter-api-sdk';
import {insertReward, RewardType} from "@/src/repositories/rewards";
type Response = {};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  await prisma.$connect();

  try {
    const { wallet } = req.body;

    const getUser = await prisma.user.findUnique({
      where: {
        wallet: wallet as string,
      },
      include: {
        userTwitterData: true,
      },
    });
    if (!getUser) {
      return res.status(404).json({ data: { message: 'User not found' } });
    }

    const useTwitterData = getUser.userTwitterData;

    const twitterClient = new Client(useTwitterData?.twitterAccessToken!);

    const followUser = await twitterClient.users.usersIdFollow(
      //The ID of the user that is requesting to follow the target user
      useTwitterData?.twitterIdstr!,
      {
        //The ID of the user that the source user is requesting to follow
        target_user_id: process.env.FLOCK_TWITTER_ID!,
      }
    );

    if (followUser.data?.following) {
      await insertReward(getUser.id,RewardType.TwitterFollow)
      return res.status(200).json({ data: { message: 'OK' } });
    } else {
      return res.status(404).json({ data: { message: 'Twitter follow not found' } });
    }
  } catch (error) {
    console.error('twitterFollowVerify error', error);
    res.status(500).json({ isMember: false, error: error?.toString() });
  }
}
