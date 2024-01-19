import { useState, useEffect, use } from 'react';
import {
  Box,
  Text,
  DropButton,
  ThemeContext,
  CheckBox,
  Spinner,
} from 'grommet';
import { useAccount } from 'wagmi';
import { PrimaryButton } from '../PrimaryButton';
import { SecondaryButton } from '../SecondaryButton';
import { FormDown, FormPrevious, Checkmark } from 'grommet-icons';
import { useRouter } from 'next/router';
import { formatDate, isFilePathLink, shortenFilename, toReadablePath } from '@/src/utils/utils';
import {Model} from "@prisma/client";


type DataContribution = {
  modelId: string;
  modelName: string;
  filePath: string;
  created_at: string;
  updatedAt: string;
  rewardAmount: number;
  dataValidationStatus: string;
};

const Previous = () => (
  <Box width="xsmall">
    <Text>Previous</Text>
  </Box>
);
const Next = () => (
  <Box width="xsmall">
    <Text>Next</Text>
  </Box>
);

export const MyModels = ({
  setShowMyModels,
}: {
  setShowMyModels: (showMyModels: boolean) => void;
}) => {
  const { address } = useAccount();
  const [models, setModels] = useState<Model[]>([]);
  const [dataContributions, setDataContributions] = useState<
    DataContribution[]
  >([]);
  const [currentSortMode, setCurrentSortMode] = useState<number>(-1);
  const [currentFilterMode, setCurrentFilterMode] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(2);
  const [isSortDropOpen, setIsSortDropOpen] = useState(false);
  const [isFilterDropOpen, setIsFilterDropOpen] = useState(false);
  const { push } = useRouter();

  const onModelRowClick = (model: Model) => {
    if (model.dataValidationStatus === 'SUCCESS') {
      push(`/model/${model.id}`);
    }
  };

  const onContributionRowClick = (contribution: DataContribution) => {
    if (contribution.dataValidationStatus === 'SUCCESS') {
      push(`/model/${contribution.modelId}`);
    }
  };

  useEffect(() => {
    if (address) {
      setLoading(true);
      setCurrentFilterMode([]);
      setCurrentSortMode(-1);
      const baseURL = window.location.origin;

      const fetchData = async () => {
        if (step === 1) {
          try {
            const response = await fetch(
              `${baseURL}/api/rag/getModels?wallet=${address?.toLowerCase()}`
            );
            const data = await response.json();
            setModels(data.Model||[]);
          } catch (error) {
            console.error('Error fetching models:', error);
          }
        } else if (step === 2) {
          try {
            const response = await fetch(
              `${baseURL}/api/rag/getDataContributions?wallet=${address?.toLowerCase()}`
            );
            const data = await response.json();
            setDataContributions(data||[]);
          } catch (error) {
            console.error('Error fetching data contributions:', error);
          }
        }
      };

      fetchData().finally(() => setLoading(false));
    }
  }, [address, step]);

  const handleStepChange = (newStep: number) => {
    setStep(newStep);
  };

  const handleBackClick = () => {
    setShowMyModels(false);
  };

  const filterCriteria = (status: string): boolean => {
    return (
      (status === 'SUCCESS' && currentFilterMode.includes(0)) ||
      (status === 'FAILURE' && currentFilterMode.includes(1)) ||
      (status === 'PENDING' && currentFilterMode.includes(2))
    );
  };

  const statusCard = (status: string) => {
    if (status === "SUCCESS") {
      return <div className="px-2 py-1 self-center rounded-3xl bg-[#54875D]">
        {status}
      </div>
    } else if (status === "PENDING") {
      return <div className="px-2 py-1 self-center rounded-3xl bg-[#879095]">
        {status}
      </div>
    } 
    return (
      <div className="px-2 py-1 self-center rounded-3xl bg-[#B8482B]">
        {status}
      </div>
    )
  };

  const handleFilterBy = (mode: number) => {
    currentFilterMode.includes(mode)
      ?
        setCurrentFilterMode(currentFilterMode.filter((m) => m !== mode))
      :
        setCurrentFilterMode([...currentFilterMode, mode]);
  };

  const sortByModes = ['Creation Time ↓', 'Creation Time ↑'];

  const filterByModes = [
    'Succeeded Status',
    'Failed Status',
    'Pending Status',
  ];

  return (
    <ThemeContext.Extend
      value={{
        pagination: {
          icons: {
            next: Next,
            previous: Previous,
          },
          button: {
            active: {
              background: {
                color: '#6C94EC',
              },
            },
            background: {
              color: 'white',
            },
          },
        },
      }}
    >
      <div className="flex h-screen justify-center bg-[#F7FAFB]">
        <div className="w-full md:w-5/6 space-y-6">
          <Box>
            <Box
              gap="small"
              fill="horizontal"
            >
              <Box
                direction="row"
                align="center"
                onClick={handleBackClick}
                margin={{ top: 'medium' }}
              >
                <FormPrevious color="lightblue" />
                <Text>Back</Text>
              </Box>
              <Box
                direction="row"
                justify="between"
              >
                <Box direction="row" gap="small" align="center">
                  <PrimaryButton
                    label={
                      <Text color={step === 1 ? "white" : "black"} weight="bold">
                        Models I created
                      </Text>
                    }
                    size="medium"
                    color={step === 1 ? "#6C94EC" : "white"}
                    border={{ color: 'black' }}
                    pad={{ vertical: 'small', horizontal: 'large' }}
                    onClick={() => handleStepChange(1)}
                  />
                  <SecondaryButton
                    label={
                      <Text color={step === 2 ? "white" : "black"} weight="bold">
                        Models I contributed to
                      </Text>
                    }
                    size="medium"
                    color={step === 2 ? "#6C94EC" : "white"}
                    pad={{ vertical: 'small', horizontal: 'large' }}
                    onClick={() => handleStepChange(2)}
                  />
                </Box>
                <Box
                  direction={window.innerWidth > 1000 ? 'row' : 'column'} 
                  gap="small"
                  align="center"
                  justify={window.innerWidth > 600 ? 'end' : 'between'}
                  flex="grow"
                  style={{
                    flexWrap: 'wrap',
                  }}
                >
                  <DropButton
                    pad="small"
                    color="white"
                    style={{
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                      color: 'black',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 'normal',
                    }}
                    label={
                      <Box direction="row" justify="between" width="small">
                        <Text>
                          {currentSortMode === -1
                            ? "Sort by"
                            : sortByModes[currentSortMode]}
                        </Text>
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
                              align="center"
                              justify="between"
                              onClick={() => setCurrentSortMode(index)}
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
                  <DropButton
                    pad="small"
                    color="white"
                    style={{
                      boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)',
                      color: 'black',
                      borderRadius: '8px',
                      border: 'none',
                      fontWeight: 'normal',
                    }}
                    label={
                      <Box direction="row" justify="between" width="small">
                        <Text>Filter</Text>
                        <FormDown />
                      </Box>
                    }
                    onOpen={() => setIsFilterDropOpen(true)}
                    dropContent={
                      <Box background="white">
                        {filterByModes.map((mode, index) => {
                          return (
                            <Box
                              pad="small"
                              direction="row"
                              gap="small"
                              align="center"
                              onClick={() => handleFilterBy(index)}
                              hoverIndicator={{
                                background: { color: '#E0E4E7' },
                              }}
                              focusIndicator={false}
                            >
                              <CheckBox checked={currentFilterMode.includes(index)} />
                              {mode}
                            </Box>
                          );
                        })}
                      </Box>
                    }
                    dropProps={{
                      round: 'small',
                      align: { top: 'bottom' },
                      margin: { top: 'small' },
                      onClickOutside: () => setIsFilterDropOpen(false),
                    }}
                    open={isFilterDropOpen}
                  />
                </Box>
              </Box>
            </Box>
          </Box>
          <div className="bg-white p-6 rounded-3xl md:h-4/5">
            <div className="overflow-y-scroll max-h-full">
              <table className="w-full border-separate border-spacing-y-4">
                <thead className="text-sm font-medium">
                  <tr>
                    <th scope="col" className="pr-4"></th>
                    <th scope="col">Model Name</th>
                    {step === 2 && <th scope="col">Knowledge File</th>}
                    <th scope="col">Creation Time</th>
                    <th scope="col">Points</th>
                    <th scope="col">Verification Status</th>
                  </tr>
                </thead>
                <tbody>
                  { step === 1 &&
                    models
                    ?.filter((model) => currentFilterMode.length === 0 || filterCriteria(model.dataValidationStatus))
                    .sort((a, b) => {
                      const dateA = new Date(a.created_at).getTime();
                      const dateB = new Date(b.created_at).getTime();
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
                    .map((model, index) => (
                      <tr className="text-sm font-semibold" onClick={() => {onModelRowClick(model)}} >
                            <td scope="row" className="text-base">
                              {index+1}
                            </td>
                            <td className="bg-[#F2F6FF] rounded-l-xl py-4 pl-6 text-center font-bold">
                              {model.modelName}
                            </td>
                            <td className="bg-[#F2F6FF] text-center">
                              {formatDate(model.created_at.toLocaleString())}
                            </td>
                            <td className="bg-[#F2F6FF] text-center text-xl font-extrabold">
                              +<b>{(model as any)?.userModelRewardAudits?.length?(model as any)?.userModelRewardAudits[0]?.rewardAmount:0}</b>
                            </td>
                            <td className="bg-[#F2F6FF] rounded-r-xl text-center">
                              <div className="flex justify-center text-white text-sm font-semibold">
                                {statusCard(model.dataValidationStatus)}
                              </div>
                            </td>
                      </tr>
                  ))}
                  { step === 2 &&
                    dataContributions
                    ?.filter((model) => currentFilterMode.length === 0 || filterCriteria(model.dataValidationStatus))
                    .sort((a, b) => {
                      const dateA = new Date(a.created_at).getTime();
                      const dateB = new Date(b.created_at).getTime();
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
                    .map((dataContribution, index) => (
                      <tr className="text-sm font-semibold" onClick={() => {onContributionRowClick(dataContribution)}}>
                            <td scope="row" className="text-base">
                              {index+1}
                            </td>
                            <td className="bg-[#F2F6FF] text-center rounded-l-xl py-4 pl-6 font-bold">
                              {dataContribution.modelName}
                            </td>
                            <td className="bg-[#F2F6FF] text-center">
                              {isFilePathLink(dataContribution.filePath)?'Link':'File name'} : {shortenFilename(toReadablePath(dataContribution.filePath))}
                            </td>
                            <td className="bg-[#F2F6FF] text-center">
                              {formatDate(dataContribution.created_at)}
                            </td>
                            <td className="bg-[#F2F6FF] text-center text-xl font-extrabold">
                              +<b>{(dataContribution as any)?.UserModelRewardAudits?.length?(dataContribution as any)?.UserModelRewardAudits[0]?.rewardAmount:0}</b>
                            </td>
                            <td className="bg-[#F2F6FF] rounded-r-xl text-center">
                              <div className="flex justify-center text-white text-sm font-semibold">
                                {statusCard(dataContribution.dataValidationStatus)}
                              </div>
                            </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
            { loading && (
              <div className="w-full flex justify-center mt-32">
                <Spinner size='large' />
              </div>
            )}
            { !loading && ((step === 1 && models?.length === 0) || (step === 2 && dataContributions?.length === 0)) && (
              <div className="w-full flex justify-center mt-32">
                <div className="space-y-10 flex flex-col justify-center">
                  <img src="/static/images/MyModelsIcon.svg" alt='No models' />
                  <PrimaryButton
                    label="Start contribution"
                    size="medium"
                    color="#6C94EC"
                    border={{ color: 'black' }}
                    pad={{ vertical: 'small', horizontal: 'medium' }}
                    onClick={handleBackClick}
                  />
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </ThemeContext.Extend>
  );
};
