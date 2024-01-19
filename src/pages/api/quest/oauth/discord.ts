import type { NextApiRequest, NextApiResponse } from 'next';
import { PrismaClient, Prisma } from '@prisma/client';
import querystring from 'querystring';
import prisma from '@/src/lib/prisma';
import {insertReward, RewardType} from "@/src/repositories/rewards";

type Response = {};

async function getDiscordUserInfo(code: string, redirectUri: string) {
  const clientId = process.env.NEXT_PUBLIC_DISCORD_CLIENT_ID;
  const clientSecret = process.env.DISCORD_CLIENT_SECRET;

  const requestData = {
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: 'authorization_code',
    code: code,
    redirect_uri: redirectUri,
  };

  const requestBody = querystring.stringify(requestData);

  const responseGetToken = await fetch('https://discord.com/api/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: requestBody,
  });

  if (!responseGetToken.ok) {
    await responseGetToken.text().then((res) => console.log(res));

    return { error: true, status: 401, message: 'Unauthorized' };
  }

  const tokenData = await responseGetToken.json();

  const responseGetUserInfo = await fetch('https://discord.com/api/users/@me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${tokenData.access_token}`,
    },
  });

  if (!responseGetUserInfo.ok) {
    return { error: true, status: 401, message: 'Unauthorized' };
  }

  const userInfo = await responseGetUserInfo.json();
  userInfo.accessToken = tokenData.access_token;
  userInfo.expiresAt = Date.now() + tokenData.expires_in * 1000;
  return userInfo;
}

async function createUserTask(prisma: PrismaClient, userId: string) {
  try {
    const task = await prisma.questTask.findUnique({
      where: {
        taskName: 'discord_connect',
      },
    });
    if (task) {
      const userTask = await prisma.userQuestTask.create({
        data: {
          userId: userId,
          taskId: task.id,
        },
      });
      await insertReward(userId,RewardType.DiscordConnect)
      console.log(userTask);
      return { error: false, status: 201, message: 'OK' };
    }
    return { error: true, status: 404, message: 'Not Found' };
  } catch (error) {
    console.log(error);
    return { error: true, status: 503, message: 'Internal Server Error' };
  }
}

async function prismaGetUserDiscordData(prisma: PrismaClient, userId: string) {
  const userDiscordData = await prisma.userDiscordData.findUnique({
    where: {
      userId: userId,
    },
  });
  return userDiscordData;
}

async function prismaInsertUserDiscordData(
  prisma: PrismaClient,
  userId: string,
  discordId: string,
  discordUserName: string,
  discordAccessToken: string,
  discordExpiresAt: string
) {
  try {
    const userDiscordData = await prisma.userDiscordData.create({
      data: {
        userId: userId,
        discordId: discordId,
        discordName: discordUserName,
        discordAccessToken,
        discordExpiresAt,
      },
    });
    return { error: false, status: 201, message: 'OK', data: userDiscordData };
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code == 'P2002') {
        return {
          error: true,
          status: 409,
          message: 'This discord account has been bound by another address',
        };
      }
    }
    return { error: true, status: 503, message: 'Internal Server Error' };
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Response>
) {
  const { wallet, code: discord_code, redirectUri } = req.body;

  await prisma.$connect();

  const discordUserInfo = await getDiscordUserInfo(
    discord_code as string,
    redirectUri as string
  );

  if (discordUserInfo.error) {
    return res
      .status(discordUserInfo.status)
      .json({ data: { message: discordUserInfo.message } });
  }

  const getUser = await prisma.user.findUnique({
    where: {
      wallet: wallet as string,
    },
    include: {
      userDiscordData: {
        select: {
          discordName: true,
          discordAccessToken: true,
          discordExpiresAt: true,
        },
      },
      userQuestTask: true,
    },
  });

  if (getUser) {
    const userDiscordData = getUser.userDiscordData;
    if (userDiscordData) {
      if (discordUserInfo.accessToken !== '') {
        await prisma.userDiscordData.update({
          where: {
            userId: getUser.id,
          },
          data: {
            discordAccessToken: discordUserInfo.accessToken,
            discordExpiresAt: discordUserInfo.expiresAt.toString(),
          },
          select: {
            discordName: true,
          },
        });
      }
      const getQuestTask = await prisma.questTask.findUnique({
        where: {
          taskName: 'discord_connect',
        },
      });

      if (!getQuestTask) {
        return res
          .status(503)
          .json({ data: { message: 'Internal Server Error' } });
      }

      const userHasTask = getUser.userQuestTask.filter(
        (usertask) => usertask.taskId == getQuestTask.id
      );
      if (!userHasTask.length) {
        const userTask = await createUserTask(prisma, getUser.id);
      }
      return res.status(200).json({ data: userDiscordData });
    } else {
      // if the user has not yer completed the task
      let result = await prismaInsertUserDiscordData(
        prisma,
        getUser.id,
        discordUserInfo.id,
        discordUserInfo.username,
        discordUserInfo.accessToken,
        discordUserInfo.expiresAt.toString()
      );
      if (result.error) {
        return res
          .status(result.status)
          .json({ data: { message: discordUserInfo.message } });
      }
      await insertReward(getUser.id,RewardType.DiscordConnect)

      const userTask = await createUserTask(prisma, getUser.id);
      console.log(userTask);
      return res.status(result.status).json({ data: result.data });
    }
  }

  return res.status(404).json({ data: { message: 'Not Found' } });
}
