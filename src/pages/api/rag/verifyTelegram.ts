import { RewardType, insertReward } from '@/src/repositories/rewards';
import { PrismaClient } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';

const prisma = new PrismaClient();

type Data = {
  isMember: boolean;
  error?: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const { telegram_id } = req.body;

  const channelId = process.env.NEXT_PUBLIC_TELEGRAM_CHANNEL_ID
  const telegramApiUrl = `https://api.telegram.org/bot${process.env.NEXT_PUBLIC_TELEGRAM_BOT_TOKEN}/getChatMember`;
  const params = new URLSearchParams();
  params.append('chat_id', channelId as string);
  params.append('user_id', telegram_id as string);

  try {
    const response = await fetch(telegramApiUrl, {
      method: 'POST',
      body: params
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    const isMember = data.result && data.result.status !== 'left' && data.result.status !== 'kicked';

    if (isMember) {
      await prisma.userTelegramData.update({
        where: { telegramId: telegram_id },
        data: { verifiedMember: true },
      });

      const getUser = await prisma.userTelegramData.findUnique({
        where: {
          telegramId: telegram_id,
        },
        select: {
          userId: true,
        }
      });

      if (getUser) {
        await insertReward(getUser.userId, RewardType.TelegramJoin)
      };
    }

    res.status(200).json({ isMember });
  } catch (error) {
    console.error('Request error', error);
    res.status(500).json({ isMember: false, error: error?.toString() });
  }
}
