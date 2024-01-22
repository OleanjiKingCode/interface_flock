import { Box, Heading, Text, Image, Layer, Spinner, Button } from 'grommet';
import { PrimaryButton } from '../PrimaryButton';
import { SecondaryButton } from '../SecondaryButton';
import { Close, FormNext, LinkNext, LinkPrevious } from 'grommet-icons';
import { useAccount } from 'wagmi';
import { useEffect, useState } from 'react';
import ToasterList from '../ToasterList';
import useToaster, { IToastContent } from '@/src/hooks/useToaster';
import { KnowledgePreview } from './KnowledgePreview';

import { Contribution } from './PreviewAndVote';
import {isFilePathLink, shortenFilename, toReadablePath} from "@/src/utils/utils";
import { RAG_REWARDS } from '@/src/constants/constants';

export interface IOnSubmitProps {
  error?: boolean;
  toast: IToastContent;
}
export interface IStepProps {
  showToaster(props: IOnSubmitProps): void;
}

export const VotingModal = ({
  modelName,
  contributions,
  currentPreview,
  setCurrentPreview,
  setIsShowPreview,
  setContributions,
}: {
  modelName: string;
  contributions: Contribution[];
  currentPreview: number;
  setCurrentPreview: (currentPreview: number) => void;
  setIsShowPreview: (isShowPreview: boolean) => void;
  setContributions: (contributions: Contribution[]) => void;
}) => {
    const [upvoteLoading, setUpvoteLoading] = useState<boolean>(false);
    const [downvoteLoading, setDownvoteLoading] = useState<boolean>(false);

  const { address } = useAccount();
  const { toasts, addToast } = useToaster();

  const showToaster = ({ toast }: IOnSubmitProps) => addToast(toast);

  const vote = async (vote: number) => {
    vote === 1 ? setUpvoteLoading(true) : setDownvoteLoading(true);

    const res = await fetch('/api/rag/voteOnKnowledge', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userWallet: address,
        contributionId: contributions[currentPreview].id,
        vote: vote,
        modelId: contributions[currentPreview].modelId,
      }),
    });

    const data = await res.json();
    console.log(data);
    console.log(res.status);
    const tempModelName = modelName?.split(' ')[-1]?.toLowerCase() === 'model' ? modelName : modelName + " model";
    if (res.status === 200) {
      const newContributions = [...contributions];
      newContributions[currentPreview].userUpvoted = vote === 1 ? true : false;
      newContributions[currentPreview].userDownvoted =
        vote === 0 ? true : false;
      newContributions[currentPreview].traffic += 1;
      setContributions(newContributions);
      showToaster({
        toast: {
          type: 'success',
          title: 'Voted successfully',
          message: `You have reveived ${RAG_REWARDS.REWARD_FOR_VOTE}FLC. You have ${data.votesLeft} more votes left for ${tempModelName} today.`,
        },
      });
    } else if (res.status === 201) {
      showToaster({
        toast: {
          type: 'error',
          title: 'Warning',
          message: `You have reached your daily vote limit for ${tempModelName}.`,
        },
      });
    } else if (res.status === 202) {
      showToaster({
        toast: {
          type: 'error',
          title: 'Vote failed',
          message: 'You alreadu voted on this contribution.',
        },
      });
    }
    vote === 1 ? setUpvoteLoading(false) : setDownvoteLoading(false);
  };

  return (
    <>
        <Layer responsive={true} background={{ opacity: 'weak' }} full={true}>
            <ToasterList toasts={toasts} />
            <Box
                background="white"
                width="large"
                height="large"
                pad={{ horizontal: 'medium', bottom: 'medium', top: 'small' }}
                gap="small"
                round="medium"
                alignSelf="center"
                margin={{ top: 'medium' }}
            >
                <Box>
                  <Button
                    icon={<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12.5 22.6191C18.023 22.6191 22.5 18.1421 22.5 12.6191C22.5 7.09614 18.023 2.61914 12.5 2.61914C6.977 2.61914 2.5 7.09614 2.5 12.6191C2.5 18.1421 6.977 22.6191 12.5 22.6191Z" stroke="#879095" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    <path d="M9.05798 9.34961L15.942 16.2336" stroke="#879095" stroke-width="2" stroke-linecap="round"/>
                    <path d="M15.942 9.34961L9.05797 16.2336" stroke="#879095" stroke-width="2" stroke-linecap="round"/>
                    </svg>
                    }
                    onClick={() => setIsShowPreview(false)}
                    alignSelf="end"
                    plain
                  />
                  <Box>
                      <Heading level="3" margin="none">Knowledge #{currentPreview+1}</Heading>
                      <Text>{isFilePathLink(contributions[currentPreview]?.filePath)?'Link':'File name'} : {shortenFilename(toReadablePath(contributions[currentPreview]?.filePath))}</Text>
                  </Box>
                </Box>
                <KnowledgePreview filePath={contributions[currentPreview]?.filePath} height='80%' />
                <Box direction="row" justify="between">
                    <Box direction="row" gap="small">
                        <SecondaryButton
                            pad={{horizontal: "medium", vertical: "small"}}
                            label="Previous"
                            icon={<LinkPrevious />}
                            disabled={currentPreview === 0 || upvoteLoading || downvoteLoading}
                            onClick={() => setCurrentPreview(currentPreview - 1)}
                        />
                        <PrimaryButton
                            pad={{horizontal: "medium", vertical: "small"}}
                            label="Next" icon={<LinkNext />}
                            reverse={true}
                            disabled={currentPreview === contributions.length - 1 || upvoteLoading || downvoteLoading}
                            onClick={() => setCurrentPreview(currentPreview + 1)}
                        />
                    </Box>
                    <Box direction="row" gap="small">
                        <PrimaryButton
                            label={
                                <Box direction="row" align="end" gap="xsmall">
                                    {upvoteLoading ? <Spinner color="white"></Spinner> : <Image alt="thumbsUp" src="/static/images/thumbsUp.png" />}
                                    {contributions[currentPreview]?.userUpvoted && <Text>+1</Text>}
                                </Box>
                            }
                            pad={{horizontal: "medium", vertical: "small"}}
                            onClick={
                                contributions[currentPreview]?.userUpvoted ||
                                contributions[currentPreview]?.userDownvoted ||
                                upvoteLoading ||
                                downvoteLoading
                                ? ()=>{} : ()=>vote(1)
                            }
                            disabled={
                              downvoteLoading ||
                              contributions[currentPreview]?.userUpvoted ||
                              contributions[currentPreview]?.userDownvoted
                            }
                        />
                        <SecondaryButton
                            color="#B8482B"
                            label={
                                <Box direction="row" align="end" gap="xsmall">
                                    {downvoteLoading ? <Spinner color="white"></Spinner> : <Image alt="thumbsDown" src="/static/images/thumbsDown.png" />}
                                    {contributions[currentPreview]?.userDownvoted && <Text color="white">+1</Text>}
                                </Box>        
                            }
                            pad={{horizontal: "medium", vertical: "small"}}
                            onClick={
                                contributions[currentPreview]?.userUpvoted ||
                                contributions[currentPreview]?.userDownvoted ||
                                upvoteLoading ||
                                downvoteLoading
                                ? ()=>{} : ()=>vote(0)
                            }
                            disabled={
                              upvoteLoading ||
                              contributions[currentPreview]?.userUpvoted ||
                              contributions[currentPreview]?.userDownvoted
                            }
                        />
                    </Box>
                </Box>
            </Box>
        </Layer>
    </>
  );
};
