import prisma from '@/src/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import Client from 'twitter-api-sdk';
import {insertReward, RewardType} from "@/src/repositories/rewards";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
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
    const usersTweets = await twitterClient.tweets.usersIdTweets(
      useTwitterData?.twitterIdstr!
    );

    const tweeted = usersTweets.data?.find((tweet) =>
      tweet.text.includes(`Be a key player in building the best chatbots in #Web3!`)
    );

    if (tweeted?.id) {
      await insertReward(getUser.id,RewardType.TwitterShare)
      return res.status(200).json({ data: { message: 'OK' } });
    } else {
      return res.status(404).json({ data: { message: 'Tweet not found' } });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error?.toString() });
  }
}
