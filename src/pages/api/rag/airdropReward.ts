import type { NextApiRequest, NextApiResponse } from 'next';
import { ethers } from 'ethers';
import { FLOCK_ABI } from '@/src/contracts/flock';
import prisma from '@/src/lib/prisma';
import { RAG_REWARDS } from '@/src/constants/constants';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // Handle airdrop reward for specific model

  const roundNumber = (num: number) => {
    return Math.round(num * 10000) / 10000;
  };

  const estimateGeometricReward = (
    userIndex: number,
    rewardsPool: number,
    fixedRewardCount: number
  ) => {
    if (userIndex <= 0 || rewardsPool <= 0 || fixedRewardCount <= 0) {
      return 0;
    }
    if (userIndex <= fixedRewardCount) {
      return rewardsPool / (fixedRewardCount * 2);
    } else {
      // Ratio = 1-(a1/S)
      const a1 = rewardsPool / (fixedRewardCount * 2);
      const ratio = 1 - a1 / rewardsPool;
      return roundNumber(a1 * ratio ** (userIndex - 1));
    }
  };

  const estimateLikesReward = (
    userLikes: number,
    userDislikes: number,
    totalLikes: number,
    totalDislikes: number,
    rewardsPool: number
  ) => {
    // R = (l/TL - d/TD) * S
    if (totalLikes === 0 && totalDislikes === 0) {
      return 0;
    }
    return roundNumber(
      (userLikes / totalLikes - userDislikes / totalDislikes) * rewardsPool
    );
  };

  const sendReward = async (amount: number, userAddress: string | null) => {
    try {
      if (!userAddress) {
        return;
      }

      const provider = new ethers.providers.JsonRpcProvider(
        process.env.NEXT_PUBLIC_WEB3_AUTH_RPC
      );

      const wallet = new ethers.Wallet(process.env.NEXT_PRIVATE_KEY!, provider);

      const tokenContract = new ethers.Contract(
        process.env.NEXT_PUBLIC_FLOCK_TOKEN_ADDRESS!,
        FLOCK_ABI,
        wallet
      );
      try {
        const txResponse = await tokenContract.transfer(
          userAddress,
          ethers.utils.parseEther(amount.toString())
        );
        await txResponse.wait();
        console.log(txResponse);
      } catch (error: any) {
        return error;
      }
    } catch (error) {
      return error;
    }
  };

  const getUserAddress = async (userID: string) => {
    if (!userID) return null;

    const user = await prisma.user.findFirst({
      where: {
        id: userID,
      },
    });

    if (!user) {
      return null;
    }

    return user.wallet;
  };

  const { rewardType, contributionId, modelId, userWallet } = await req.body;

  try {
    /*
            REWARD TYPES
            1 - Data reward for validated contribution based on user order
            2 - Data reward when campaign finishes based on user likes/dislikes
            3 - Immediate reward for like/dislike
            4 - Model reward for creation
            5 - Model reward when campaign finishes based on likes/dislikes
        */

    switch (rewardType) {
      case 1:
        if (!contributionId) {
          return res.status(404).json({ error: 'Contribution not found' });
        }

        const contribution = await prisma.dataContribution.findUnique({
          where: {
            id: contributionId,
          },
          include: { Model: true },
        });

        if (!contribution) {
          return res.status(404).json({ error: 'Contribution not found' });
        }

        const model = await prisma.model.findFirst({
          where: {
            id: contribution.modelId,
          },
        });

        if (!model) {
          return res.status(404).json({ error: 'Model not found' });
        }

        const allContributions = await prisma.dataContribution.findMany({
          where: {
            modelId: modelId as string,
          },
          orderBy: {
            created_at: 'asc',
          },
        });

        const contributionIndex = allContributions.findIndex(
          (contrib) => contrib.id === contributionId
        );

        const orderReward = estimateGeometricReward(
          contributionIndex + 1,
          RAG_REWARDS.ORDER_REWARDS_POOL,
          RAG_REWARDS.PEOPLE_WHO_GET_FIXED_REWARD
        );

        await prisma.dataContribution.update({
          where: {
            id: contributionId as string,
          },
          data: {
            rewardAmount: {
              increment: orderReward,
            },
          },
        });

        const contributiorAddress = await getUserAddress(
          contribution?.userId as string
        );
        await sendReward(orderReward, contributiorAddress);
        break;
      case 2:
        if (!modelId) {
          return res.status(404).json({ error: 'Model not found' });
        }
        const contributions = await prisma.dataContribution.findMany({
          where: {
            modelId: modelId as string,
          },
          orderBy: {
            created_at: 'asc',
          },
        });

        if (!contributions || contributions.length === 0) {
          return res
            .status(404)
            .json({ error: 'Data contributions not found' });
        }

        if (contributions.length >= RAG_REWARDS.CONTRIBUTOR_REQUIREMENT) {
          const modelData = await prisma.model.findFirst({
            where: {
              id: modelId as string,
            },
          });

          if (!modelData) {
            res.status(404).json({ error: 'Model not found' });
          }

          try {
            await prisma.model.update({
              data: {
                rewardAmount: {
                  increment: Number(RAG_REWARDS.REWARD_FOR_CONTRIBUTORS),
                },
              },
              where: {
                id: modelId as string,
              },
            });
          } catch (error) {
            console.log(error);
          }

          const creatorAddress = await getUserAddress(
            modelData?.userId as string
          );
          await sendReward(RAG_REWARDS.REWARD_FOR_CONTRIBUTORS, creatorAddress);
        }

        const totalContributionLikes = contributions.reduce(
          (acc, contribution) => acc + contribution.upvote,
          0
        );
        const totalContributionDislikes = contributions.reduce(
          (acc, contribution) => acc + contribution.downvote,
          0
        );

        // Estimate reward for each contribution
        for (let i = 0; i < contributions.length; i++) {
          const contribution = contributions[i];

          const likesReward = estimateLikesReward(
            contribution.upvote,
            contribution.downvote,
            totalContributionLikes,
            totalContributionDislikes,
            RAG_REWARDS.LIKES_REWARDS_POOL_CONTRIBUTIONS
          );

          const totalReward = Math.max(likesReward, 0);

          await prisma.dataContribution.update({
            where: {
              id: contribution.id,
            },
            data: {
              rewardAmount: {
                increment: totalReward,
              },
            },
          });

          const contributiorAddress = await getUserAddress(
            contribution?.userId as string
          );
          await sendReward(totalReward, contributiorAddress);
        }

        break;
      case 3:
        if (!userWallet) {
          return res.status(404).json({ error: 'User wallet not found' });
        }
        await sendReward(RAG_REWARDS.REWARD_FOR_VOTE, userWallet);
        break;
      case 4:
        if (!modelId) {
          return res.status(404).json({ error: 'Model not found' });
        }
        const modelData = await prisma.model.findFirst({
          where: {
            id: modelId as string,
          },
        });

        if (!modelData) {
          res.status(404).json({ error: 'Model not found' });
        }

        await prisma.model.update({
          data: {
            rewardAmount: {
              increment: Number(RAG_REWARDS.REWARD_FOR_MODEL_CREATION),
            },
          },
          where: {
            id: modelId as string,
          },
        });

        const creatorAddress = await getUserAddress(
          modelData?.userId as string
        );
        await sendReward(RAG_REWARDS.REWARD_FOR_MODEL_CREATION, creatorAddress);
        break;
      case 5:
        const models = await prisma.model.findMany({
          orderBy: {
            created_at: 'asc',
          },
        });

        const totalLikes = models.reduce((acc, model) => acc + model.upvote, 0);
        const totalDislikes = models.reduce(
          (acc, model) => acc + model.downvote,
          0
        );

        for (let i = 0; i < models.length; i++) {
          const model = models[i];

          const likesReward = estimateLikesReward(
            model.upvote,
            model.downvote,
            totalLikes,
            totalDislikes,
            RAG_REWARDS.LIKES_REWARDS_POOL_MODELS
          );

          const totalReward = Math.max(likesReward, 0);

          await prisma.model.update({
            where: {
              id: model.id,
            },
            data: {
              rewardAmount: {
                increment: totalReward,
              },
            },
          });

          const userAddress = await getUserAddress(model?.userId as string);
          await sendReward(totalReward, userAddress);
        }

        break;
      case 6:
        if (!contributionId) {
            return res.status(404).json({ error: 'Contribution not found' });
        }

        const dc = await prisma.dataContribution.findUnique({
            where: {
                id: contributionId
            }
        });

        if (!dc) {
            return res.status(404).json({ error: 'Contribution not found' });
        }

        const modelContributions = await prisma.dataContribution.findMany({
            where: {
                modelId: dc.modelId as string
            },
            orderBy: {
                created_at: 'asc'
            }
        });

        const orderIndex = modelContributions.findIndex((contrib) => contrib.id === contributionId);

        const estimatedReward = estimateGeometricReward(
            orderIndex+1,
            RAG_REWARDS.ORDER_REWARDS_POOL,
            RAG_REWARDS.PEOPLE_WHO_GET_FIXED_REWARD
        );
        return res.status(200).json({ reward: estimatedReward });
      default:
        return res.status(404).json({ error: 'Invalid reward type' });
    }

    return res.status(200).json({ message: 'Reward sent' });
  } catch (error) {
    res.status(500).json(error);
  }
}
