import prisma from '@/src/lib/prisma';
import { RewardType, insertReward } from '@/src/repositories/rewards';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

type Response = {
  data: {
    message: string;
    user: any;
  };
};

const getUser = async (prisma: PrismaClient, wallet: string) => {
  return await prisma.user.findUnique({
    where: {
      wallet,
    },
    select: {
      wallet: true,
      id: true,
      userDiscordData: {
        select: {
          discordName: true,
          discordExpiresAt: true,
        },
      },
      userTwitterData: {
        select: {
          twitterName: true,
          twitterExpiresAt: true,
        },
      },
      userQuestTask: {
        select: {
          questTask: {
            select: {
              taskName: true,
            },
          },
        },
      },
    },
  });
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  await prisma.$connect();

  try {
    let user = await getUser(prisma, req.body.wallet);
    console.log(user);
    if (user) {
      await insertReward(user.id, RewardType.WalletConnect);
      if (
        !user?.userQuestTask.find(
          (task: any) => task.questTask.taskName === 'claim_reward'
        )
      ) {
        const discordExpiresAt = new Date(
          Number(user.userDiscordData?.discordExpiresAt!)
        ); // milliseconds
        const twitterExpiresAt = new Date(
          Number(user.userTwitterData?.twitterExpiresAt!)
        );

        if (
          user.userTwitterData?.twitterExpiresAt === '' ||
          user.userDiscordData?.discordExpiresAt === '' ||
          twitterExpiresAt.getTime() < Date.now() ||
          discordExpiresAt.getTime() < Date.now()
        ) {
          await prisma.userQuestTask.deleteMany({
            where: {
              userId: user.id,
            },
          });
          user = await getUser(prisma, req.body.wallet);
        }
      }

      return res.status(200).json({ data: { message: 'OK', user } });
    }

    const createUser = await prisma.user.create({
      data: {
        wallet: req.body.wallet,
      },
      select: {
        wallet: true,
        id: true,
      },
    });
    await insertReward(createUser.id, RewardType.WalletConnect);
    return res.status(200).json({ data: { message: 'OK', user: createUser } });
  } catch (error) {
    console.log(error);
    return res
      .status(503)
      .json({ data: { message: 'Internal Server Error', user: null } });
  }
}
