import prisma from '@/src/lib/prisma';
import {insertReward, RewardType} from "@/src/repositories/rewards";

export const populateRewards = async () => {
  const models = await prisma.model.findMany({
    where: {
      dataValidationStatus: 'SUCCESS',
    },
  });
  for(let model of models){
    await insertReward(model.userId,RewardType.ModelCreation,model.id,undefined,model.created_at)
  }
  const dataContributions = await prisma.dataContribution.findMany({
    where: {
      dataValidationStatus: 'SUCCESS',
    }
  });
  for(let contribution of dataContributions){
    if(contribution.userId){
      await insertReward(contribution.userId,RewardType.ModelContribution,contribution.modelId,contribution.id,contribution.created_at)
    }
  }
  const tasks = await prisma.userQuestTask.findMany()
  for(let task of tasks){
    if(task.userId){
      const taskObj=await prisma.questTask.findUnique({
        where:{
          id:task.taskId
        }
      })
      switch (taskObj?.taskName) {
        case 'discord_connect':
          await insertReward(task.userId,RewardType.DiscordConnect)
          break;
        case 'twitter_follow':
          await insertReward(task.userId,RewardType.TwitterFollow)
          break;
        case 'twitter_share':
          await insertReward(task.userId,RewardType.TwitterShare)
          break;
        case 'discord_join_get_role':
          await insertReward(task.userId,RewardType.DiscordJoinGetRole)
          break;
        case 'twitter_connect':
          await insertReward(task.userId,RewardType.TwitterConnect)
          break;
        case 'claim_reward':
          await insertReward(task.userId,RewardType.ClaimReward)
          break;
        default:
          break;
      }
    }
  }
}
