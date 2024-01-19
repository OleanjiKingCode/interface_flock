import prisma from '@/src/lib/prisma';
import { NextApiRequest, NextApiResponse } from 'next';
import Client from 'twitter-api-sdk';
type Response = {};

const tweetTemplate = `Hey you, out there in the cold
    Getting lonely, getting old
    Can you feel me?
    Hey you, standing in the aisles
    With itchy feet and fading smiles
    Can you feel me?
    Hey you, don't help them to bury the light
    Don't give in without a fight`;

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
        userQuestTask: true,
        userTwitterData: true,
      },
    });

    if (getUser) {
      const useTwitterData = getUser.userTwitterData;
      const getQuestTask = await prisma.questTask.findUnique({
        where: {
          taskName: 'twitter_share',
        },
      });

      if (!getQuestTask) {
        return res
          .status(503)
          .json({ data: { message: 'Internal Server Error' } });
      }

      console.log(useTwitterData?.twitterAccessToken);
      const twitterClient = new Client(useTwitterData?.twitterAccessToken!);

      const postTweet = await twitterClient.tweets.createTweet({
        // The text of the Tweet
        text: tweetTemplate,

        // Options for a Tweet with a poll
        poll: {
          options: ['Yes', 'Maybe', 'No'],
          duration_minutes: 120,
        },
      });
      console.dir(postTweet, {
        depth: null,
      });

      if (postTweet.data) {
        const updateTwitterData = await prisma.userTwitterData.update({
          where: {
            userId: getUser.id,
          },
          data: {
            twitterTweetId: postTweet.data.id,
          },
        });
        return res
          .status(201)
          .json({ data: { postTweet: { tweetId: postTweet.data?.id } } });
      }

      return res
        .status(503)
        .json({ data: { message: 'Internal Server Error' } });
    }
  } catch (error) {
    console.log(error);
  }
}
