import { Box, Text, Image, Grid, DropButton } from 'grommet';
import { PrimaryButton } from '../PrimaryButton';
import { useEffect, useState } from 'react';
import { VotingModal } from './VotingModal';
import { useAccount } from 'wagmi';
import { User } from '@prisma/client';
import truncateEthAddress from 'truncate-eth-address';
import {formatDate, isFilePathLink, shortenFilename, toReadablePath} from "@/src/utils/utils";
import { RAG_REWARDS } from '@/src/constants/constants';
import { Checkmark, FormDown } from 'grommet-icons';
import useEventListener from "@/src/hooks/useEventListener";
import {
  NOTIFICATION_TYPE_CONTRIBUTION_VERIFIED,
  NOTIFICATION_TYPE_REWARD_UPDATED
} from "@/src/constants/notificationTypes";

export type Contribution = {
  filePath: string;
  modelId: string;
  id: string;
  userUpvoted: boolean;
  userDownvoted: boolean;
  user: User;
  createdAt: Date;
  traffic: number;
};

export const PreviewAndVote = ({ modelId, modelName }: { modelId: string, modelName: string }) => {
  const [contributors, setContributors] = useState<Contribution[]>([]);
  const [totalContributors, setTotalContributors] = useState<number>(1);
  const [contributorsLoading, setContributorsLoading] =
    useState<boolean>(false);
  const [currentPreview, setCurrentPreview] = useState<number>(0);
  const [isShowPreview, setIsShowPreview] = useState<boolean>(false);
  const [isSortDropOpen, setIsSortDropOpen] = useState<boolean>(false);
  const [currentSortMode, setCurrentSortMode] = useState<number>(-1); // -1: default, 0: creation time desc, 1: creation time asc, 2: traffic desc, 3: traffic asc
  const { address } = useAccount();


  const sortByModes = ['Creation Time ↓', 'Creation Time ↑'];
  const [localWindow,setWindow]=useState<Window>()
  useEffect(() => {
    if(window){
      setWindow(window)
    }
  }, []);


  const handleEvent = (data: any) => {
    loadContributors().then()
  };
  useEventListener(NOTIFICATION_TYPE_CONTRIBUTION_VERIFIED, handleEvent,localWindow);

  // Load total len of contributors from db

  const loadContributors = async () => {
    setContributorsLoading(true);
    const currentLen = contributors.length;

    try {
      const res = await fetch(
        `/api/rag/listDataContributions?modelId=${modelId}&skipRecords=${currentLen}&status=${'SUCCESS'}`
      );
      const data = await res.json();
      let tempContributors: Contribution[] = [];
      for (let i = 0; i < data.length; i++) {
        const userRes = await fetch(
          `/api/rag/getUserVotes?userWallet=${address}&contributionId=${data[i].id}`
        );
        const userData = await userRes.json();
        const contributionData: Contribution = {
          filePath: data[i].filePath,
          modelId: data[i].modelId,
          id: data[i].id,
          userUpvoted: userData.upvoted,
          userDownvoted: userData.downvoted,
          user: data[i].User,
          createdAt: data[i].created_at,
          traffic: data[i].upvote + data[i].downvote,
        };
        tempContributors.push(contributionData);
      }
      setContributors([...contributors, ...tempContributors]);
    } catch (error) {
      console.log(error);
    }
    setContributorsLoading(false);
  };

  const loadTotalContributors = async () => {
    setContributorsLoading(true);
    try {
      const res = await fetch(
        `/api/rag/getTotalContributions?modelId=${modelId}`
      );
      const data = await res.json();
      setTotalContributors(data.count);
    } catch (error) {
      console.log(error);
    }
    setContributorsLoading(false);
  };

  useEffect(() => {
    loadTotalContributors();
    loadContributors();
  }, [modelId]);

  return (
    <>
      <Box gap="medium" fill round="medium">
        {isShowPreview && (
          <VotingModal
            modelName={modelName}
            contributions={contributors}
            currentPreview={currentPreview}
            setCurrentPreview={setCurrentPreview}
            setIsShowPreview={setIsShowPreview}
            setContributions={setContributors}
          />
        )}
        <Box fill height={{max: "large"}} background="white" round="medium" pad="medium">
          <div className="flex flex-col space-y-4 lg:flex-row lg:space-y-0 justify-between">
            <div className="lg:w-2/3">
              <h2 className="text-lg font-extrabold">Knowledge base</h2>
              <p className="text-sm font-medium">
              Inspect the community-contributed knowledge base of this specific AI agent</p>              
            </div>
            <div className="flex items-center self-end lg:self-center">
              <DropButton
                pad="small"
                color="white"
                style={{ boxShadow: "0px 8px 16px 0px rgba(43, 53, 116, 0.06)", color: 'black', borderRadius: '8px', border: 'none', fontWeight: 'normal' }}
                
                label={
                  <Box direction="row" justify="between" width="small">
                    <Text>{currentSortMode === -1 ? "Sort by" : sortByModes[currentSortMode]}</Text>
                    <FormDown />
                  </Box>
                }
                onOpen={() => setIsSortDropOpen(true)}
                dropContent={
                  <Box background="white">
                    {sortByModes.map((mode, index) => {
                      return (
                        <Box
                          pad="small"
                          direction="row"
                          align='center'
                          justify='between'
                          onClick={() => {
                            setCurrentSortMode(currentSortMode === index ? -1 : index)
                            setIsSortDropOpen(false);
                          }}
                          hoverIndicator={{
                            background: { color: '#E0E4E7' },
                          }}
                          focusIndicator={false}
                        >
                          {mode}
                          {currentSortMode === index && (
                            <Checkmark color="#6C94EC" />
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                }
                dropProps={{
                  round: 'small',
                  align: { top: 'bottom' },
                  margin: { top: 'small' },
                  onClickOutside: () => setIsSortDropOpen(false),
                }}
                open={isSortDropOpen}
              />  
            </div>
          </div>
          <div className="flex-grow overflow-auto mt-4">
            <table className="w-full relative border-separate border-spacing-y-4">
              <thead className="text-sm font-medium">
                <tr>
                  <th scope="col" className="sticky pr-4"></th>
                  <th scope="col" className="sticky">Knowledge summary</th>
                  <th scope="col" className="sticky">Creation Time</th>
                  <th scope="col" className="sticky"></th>
                </tr>
              </thead>
              <tbody>
                {contributors
                  .sort((a, b) => {
                    const dateA = new Date(a.createdAt).getTime();
                    const dateB = new Date(b.createdAt).getTime();
                    if (currentSortMode === -1) {
                      return 0;
                    } else if (currentSortMode === 0) {
                      return dateB - dateA;
                    } else if (currentSortMode === 1) {
                      return dateA - dateB;
                    } else {
                      return 0;
                    }
                  })
                  .map((contributor, index) => (
                    <tr className="text-sm font-semibold">
                      <td scope="row">
                        {index+1}
                      </td>
                      <td className="bg-[#F2F6FF] rounded-l-xl py-4 pl-6">
                          {isFilePathLink(contributor.filePath)?'Link':'File name'} : {shortenFilename(toReadablePath(contributor.filePath))}
                      </td>
                      <td className="bg-[#F2F6FF] text-center">
                          {formatDate(contributor.createdAt.toString())}
                      </td>
                      <td className="bg-[#F2F6FF] rounded-r-xl pr-6 text-end">
                          <button
                            onClick={() => {
                              setCurrentPreview(index);
                              setIsShowPreview(true);
                            }}
                            className="text-base font-bold text-[#6C93EC]"
                          >
                              Preview
                          </button>
                      </td>
                    </tr>                    
                  ))
                }
              </tbody>
            </table>
            {(contributorsLoading || totalContributors > contributors.length) && (
              <div className="text-center py-2">
                <PrimaryButton
                  busy={contributorsLoading}
                  label="Load more"
                  pad={{ horizontal: 'large' }}
                  onClick={() => loadContributors()}
                />
              </div>
            )}
          </div>
        </Box>
      </Box>
    </>
  );
};
