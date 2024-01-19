import { Avatar, Box, Button, Image, Layer, Text, TextInput } from 'grommet';
import { Layout, PrimaryButton } from '../components';
import { Search } from 'grommet-icons';
import { useEffect, useState } from 'react';
import { CreateModel } from '../components/CreateModel';
import { useRouter } from 'next/router';
import { Model } from '@prisma/client';
import { MyModels } from '../components/RAG/MyModels';
import { ReCaptchaPageView } from '../components/ReCaptchaPageView';
import { useConnectWallet } from '../hooks/useConnectWallet';
import { Countdown } from '../components/Countdown';
import { DATA_FARMING_1_DEADLINE } from '../constants/constants';


type RoundCardProps = {
  cardData: {
    description: string,
    image: string,
    number: number,
    targetDate: number
  }
}

const RoundCard = ({cardData}: RoundCardProps) => {
  return (
    <div className="p-7 h-64 bg-white rounded-xl flex flex-col justify-between" style={{boxShadow: "0px 8px 16px 0px rgba(43, 53, 116, 0.06)"}}>
      <div className="justify-start space-y-2">
        <img src={cardData.image} alt="icon" className="" />
        <p className="font-semibold text-[22px]">Data farming round {cardData.number}</p>
        <button disabled className="text-white font-medium text-base py-2 px-4 rounded bg-[#6C93EC]">
          {cardData.description}
        </button>
      </div>
      <div className="flex flex-row items-start justify-start space-x-1">
        <p className="font-semibold text-lg text-gray-500">{cardData.targetDate === 0 ? "Coming soon" : "Ends in"}</p>
        { cardData.targetDate !== 0 && <Countdown targetDate={cardData.targetDate} /> }
      </div>
    </div>
  )
}

const FooterCards = () => {
  const RoundButton = ({path}:{path: string}) => {
    return (
      <button className="w-8 h-8 rounded-2xl bg-white flex items-center justify-center">
        <svg width="19" height="11" viewBox="0 0 19 11" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M13.2627 1.47351L17.4197 5.72518L13.2627 9.97686" stroke="#6C93EC" stroke-width="1.5" stroke-linecap="round"/>
          <path d="M16.6814 5.72668H1.60889" stroke="#6C93EC" stroke-width="1.5" stroke-linecap="round"/>
        </svg>
      </button>
    )
  }

  return (
    <div className="w-5/6 grid grid-cols-1 lg:grid-cols-3 grid-rows-24 lg:grid-rows-10 gap-6 h-fit">
      <div className="row-span-10 bg-gradient-to-t from-[#6C93EC] rounded-2xl p-10 space-y-10 border-2 border-[#f7fafb] hover:border-[#6C93EC]">
        <a href="https://docs.flock.io/rag/ai-co-creation-platform/guidelines#model-customisation" target="_blank" className="h-full flex flex-col justify-between">
          <div className="space-y-2 w-3/5">
            <h3 className="text-2xl leading-6 font-semibold w-4/5">Model Customization</h3> 
            <p className="text-sm leading-4 font-medium">Utilize RAG to develop a domain-specific chatbot, tailored to specific applications</p>
            <RoundButton path="" />
          </div>
          <div>
            <img src="/static/images/cocreation/Group-1.svg" alt="icon" className="mx-auto"/>
          </div>
        </a>
      </div>
      <div className="row-span-4 bg-gradient-to-r from-[#6C93EC] rounded-2xl p-4 border-2 border-[#f7fafb] hover:border-[#6C93EC]">
        <a href="https://docs.flock.io/rag/ai-co-creation-platform/guidelines#knowledge-contribution" target="_blank" className="flex flex-row space-x-4 items-center h-full">
          <img src="/static/images/cocreation/Group-2.svg" alt="icon" className="lg:w-2/5 w-1/4"/>
          <div className="my-4 space-y-1">
            <h3 className="text-2xl leading-6 font-semibold">Knowledge Contribution</h3> 
            <p className="text-sm leading-4 font-medium">Enhance the agent's knowledge base with targeted, domain-relevant data contribution.</p>
            <RoundButton path="" />
          </div>          
        </a>
      </div>
      <div className="row-span-4 bg-gradient-to-r from-[#6C93EC] rounded-2xl p-4 flex flex-row space-x-4 border-2 border-[#f7fafb] hover:border-[#6C93EC]">
        <a href="https://docs.flock.io/rag/ai-co-creation-platform/guidelines#model-evaluation" target="_blank" className="flex flex-row space-x-4 items-center h-full">
          <img src="/static/images/cocreation/Group-3.svg" alt="icon" className="lg:w-2/5 w-1/4"/>
          <div className="my-4 space-y-1">
            <h3 className="text-2xl leading-6 font-semibold">Model Evaluation</h3> 
            <p className="text-sm leading-4 font-medium">Interact with the AI agent to assess the performance and accuracy of the RAG-enhanced LLM.</p>
            <RoundButton path="" />
          </div>          
        </a>
      </div>
      <div className="row-span-6 lg:col-span-2 bg-gradient-to-l from-[#6C93EC] rounded-2xl lg:flex lg:flex-row justify-between p-10 lg:px-16 border-2 border-[#f7fafb] hover:border-[#6C93EC]">
        <a href="https://docs.flock.io/rag/ai-co-creation-platform/guidelines#quality-assurance" target="_blank" className="lg:flex lg:flex-row justify-between">
          <div className="space-y-2 self-center">
            <h3 className="text-2xl leading-6 font-semibold w-1/3">Quality Assurance</h3> 
            <p className="text-sm leading-4 font-medium w-2/3">Evaluate and refine the knowledge base to ensure its alignment with specific use cases.</p>
            <RoundButton path="" />
          </div>
          <img src="/static/images/cocreation/Group-4.svg" alt="icon" className="mx-auto"/>
        </a>
      </div>
    </div>
  )
}

export default function CoCreationPage() {
  const { push } = useRouter();
  const [showCreateModel, setShowCreateModel] = useState(false);
  const [models, setModels] = useState<Model[]>([]);
  const [totalModels, setTotalModels] = useState<number>(0);
  const [modelsLoading, setModelsLoading] = useState<boolean>(false);
  const [showMyModels, setShowMyModels] = useState(false);
  const { isConnected, handleConnect } = useConnectWallet();
  const [searchFilter, setSearchFilter] = useState<string>('');

  const roundCardsData = [
    {
      description: "Contribute to earn",
      image: "/static/images/cocreation/card-coin.svg",
      number: 1,
      targetDate: DATA_FARMING_1_DEADLINE
    },
    {
      description: "Vote to earn",
      image: "/static/images/cocreation/trade.svg",
      number: 2,
      targetDate: 0
    },
    {
      description: "Create to earn",
      image: "/static/images/cocreation/coins.svg",
      number: 3,
      targetDate: 0
    },
  ]

  const loadModels = async () => {
    setModelsLoading(true);
    const currentLen = models.length;
    const response = await fetch(`/api/rag/getSuccessfulModels?skipRecords=${currentLen}`);
    const data = await response.json();
    setModelsLoading(false);
    setModels([...models, ...data]);
  };

  const loadTotalModels = async () => {
    const response = await fetch(`/api/rag/getTotalSuccessfulModels`);
    const data = await response.json();
    setTotalModels(data.count);
  };

  useEffect(() => {
    const search = window.location.search;
    const params = new URLSearchParams(search);
    const myModels = Number(params.get('showMyModels'));
    setShowMyModels(myModels === 1);
    loadTotalModels();
    loadModels();
  }, []);

  const handleCreateNewModel = () => {
    if (isConnected) {
      setShowCreateModel(true);
    } else {
      handleConnect();
    }
  };

  const handleShowMyModels = () => {
    if (isConnected) {
      setShowMyModels(true);
    } else {
      handleConnect();
    }
  };

  const trimText = (text: string, symbols: number) => {
    if (text.length > symbols) {
      return text.substring(0, symbols) + '...';
    }
    return text;
  }

  return (
    <>
      <ReCaptchaPageView />
      <Layout>
        <Box justify="center" gap="medium" alignSelf="center">
          <div className="bg-white w-full py-14 flex justify-center">
            <div className="w-5/6">
              <div className="space-y-3 text-black">
                <h1 className="text-4xl font-semibold">AI Co-creation Platform</h1>
                <p className="text-lg font-normal w-2/3">The platform with incentivized collaboration, enabling easy integration of external data and enhancing domain-specific LLM accuracy through Retrieval-Augmented Generation technology.</p>
              </div>
              <div className='flex flex-row space-x-10 pt-10'>
                <Button
                  secondary
                  color="white"
                  label="Hub guide"
                  pad={{ horizontal: 'large', vertical: 'small' }}
                  href='https://docs.flock.io/rag/ai-co-creation-platform/guidelines'
                  target='_blank'
                />
                <Button
                  primary
                  pad={{ horizontal: 'medium', vertical: 'small' }}
                  label="Create new model"
                  onClick={() => handleCreateNewModel()}
                />
              </div>
            </div>
          </div>
          {/* <Box direction="row" align="center" gap="medium" justify="between">
            <Box alignSelf="start">
              <TextInput
                placeholder="Search"
                type="search"
                icon={<Search />}
                onChange={(event) => setSearchFilter(event.target.value)}
              />
            </Box>
            <Box direction="row" gap="medium">
              <Button
                primary
                label="Create new model"
                onClick={() => handleCreateNewModel()}
              />
              <Button
                secondary
                label="My models"
                onClick={() => handleShowMyModels()}
              />
            </Box>
          </Box> */}
          <div className="w-full flex flex-col items-center">
            <div className="w-5/6 py-6 grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 mb-20">
            {
              roundCardsData.map((cardData, index) => {
                return (
                  <RoundCard key={index} cardData={cardData} />
                )
              })
            }
            </div>
            <div className="w-5/6 pb-4">
              <h3 className="text-2xl font-extrabold text-black">Recommended agents</h3>
            </div>
            <div className="w-5/6 grid grid-cols-1 gap-y-5 gap-x-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
            {models
              ?.filter((model: Model) => {
                if (searchFilter === '') {
                  return true;
                }
                
                return model.tags?.split(',').some((tag: string) => {
                  tag.toLowerCase().startsWith(searchFilter.toLowerCase())
                }) || model.modelName?.toLowerCase().includes(searchFilter.toLowerCase())
              })
              ?.map((model: Model) => {
                return (
                  <Box
                    key={model.id}
                    direction="row"
                    round
                    pad="medium"
                    align="center"
                    justify="between"
                    height={{ min: '160px' }}
                    background="#FFFFFF"
                    onClick={() => push(`/model/${model.id}`)}
                    style={{boxShadow: "0px 8px 16px 0px rgba(43, 53, 116, 0.06)"}}
                  >
                    <Box alignSelf="start" gap="xsmall" width="80%">
                      <Box direction="row" gap="small">
                        {model.tags?.split(',').slice(0,2).map((tag: string) => {
                          return (
                            <div className="bg-[#F2F6FF] py-1 px-2 rounded-xl w-fit">
                              <p className="text-xs font-medium">{tag}</p>
                            </div>
                          );
                        })}
                      </Box>
                      <Text size="16px" weight="bold">{trimText(model?.modelName!, 35)}</Text>
                      <Text size="14px" color="grey" wordBreak="break-all">{trimText(model?.description!, 185)}</Text>
                    </Box>

                    <Avatar>
                      <Box width="small" height="small">
                        <Image
                          src={model.modelIcon! ? model.modelIcon : 'emoji1.png'}
                        />
                      </Box>
                    </Avatar>
                  </Box>
                );
              })
            }
            </div>
            <Box align="center" margin={{top: "medium"}}>
              {(totalModels > models.length || modelsLoading) && (
                <PrimaryButton
                  busy={modelsLoading}
                  label="Load more"
                  pad={{ horizontal: 'large' }}
                  onClick={() => loadModels()}
                />
              )}
            </Box>
            <div className="w-5/6 text-center mt-32 mb-10">
              <h3 className="text-3xl font-semibold text-black">How to get started with Co-creation?</h3>
            </div>
            <FooterCards />
          </div>
          <div className="bg-[#6C93EC] py-14 mt-32 flex justify-center">
            <div className="w-5/6 px-4">
              <h1 className="text-3xl font-extrabold text-white">Check your contributions</h1>
                <div className="flex flex-row justify-between items-center"> 
                  <p className="text-lg font-medium text-white">View the models you have created or contributed to the knowledge base</p>
                  <Button
                    secondary
                    color="white"
                    label="Go to my contribution"
                    onClick={() => handleShowMyModels()}
                    pad={{ horizontal: 'large'}}
                  />
                </div>
            </div>
          </div>
        </Box>

        {showCreateModel && (
          <Layer responsive={true} full margin={{horizontal: "250px"}}>
            <CreateModel setShowCreateModel={setShowCreateModel} />
          </Layer>
        )}
        {showMyModels && (
          <Layer responsive={true} full>
            <MyModels setShowMyModels={setShowMyModels} />
          </Layer>
        )}
      </Layout>
    </>
  );
}
