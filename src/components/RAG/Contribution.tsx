'use client'
import { Box, Button, Heading, Layer, Spinner, Text, Image, Anchor, } from 'grommet';
import { Close, LinkNext, LinkPrevious } from 'grommet-icons';
import {
  useEffect,
  useRef,
  useState,
} from 'react';
import { ContentUpload } from './ContentUpload';
import { useAccount } from 'wagmi';
import { DataContribution, Model } from '@prisma/client';
import useEventListener from '@/src/hooks/useEventListener';
import { Tooltip } from 'flowbite-react';
import {
  NOTIFICATION_TYPE_CONTRIBUTION_VERIFIED,
  NOTIFICATION_TYPE_REWARD_UPDATED
} from '@/src/constants/notificationTypes';
import { KnowledgePreview } from './KnowledgePreview';
import { SecondaryButton } from '../SecondaryButton';
import { PrimaryButton } from '../PrimaryButton';
import { isFilePathLink, shortenFilename, toReadablePath } from '@/src/utils/utils';
import { useConnectWallet } from '@/src/hooks/useConnectWallet';

type ReceiveRewardsPageProps = {
  filesNumber: number;
  modelId?: string;
  contributionIds: string[];
  validationStatus: FileValidation[];
  fileName?: string;
  setShowLoadingModal: (show: boolean) => void;
  rewards: number;
};

const ReceiveRewardsPage = ({
  filesNumber,
  contributionIds,
  validationStatus,
  setShowLoadingModal,
  rewards
}: ReceiveRewardsPageProps) => {
  const [number, setNumber] = useState(0);
  useEffect(() => {
    if(filesNumber){
      setNumber(filesNumber)
    }
  }, [filesNumber]);
  const commonButtonStyle = {
    width: '300px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    border: '2px solid black',
    borderRadius: '40px',
  };

  const rewardStyle = {
    display: 'inline-block',
    backgroundColor: '#F2F6FF',
    borderRadius: '40px',
    padding: '10px 24px',
    margin: '10px 0',
  };

  const isSubmitting=contributionIds.length<filesNumber
  const toSubmitted=filesNumber-contributionIds.length
  const isPending= validationStatus?.length<contributionIds.length || isSubmitting
  const isSuccess= validationStatus?.filter(item=>item.dataValidationStatus==='SUCCESS')?.length===contributionIds.length && !isSubmitting
  const isFailure=validationStatus?.filter(item=>item.dataValidationStatus==='FAILURE')?.length===contributionIds.length && !isSubmitting

  if(isSuccess){
    return  <Box fill align="center" justify="center">
      <Box
        pad="medium"
        gap="small"
        align="center"
        round="small"
      >
        <svg width="76" height="77" viewBox="0 0 76 77" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M37.5 9.45337C21.7614 9.45337 9 22.2148 9 37.9534C9 53.692 21.7614 66.4534 37.5 66.4534C53.2386 66.4534 66 53.692 66 37.9534C66 22.2148 53.2386 9.45337 37.5 9.45337ZM51.0018 29.617C51.6443 28.7185 51.4368 27.4693 50.5384 26.8268C49.6399 26.1843 48.3907 26.3918 47.7482 27.2903L34.6587 45.5944L27.0126 38.2286C26.2171 37.4622 24.951 37.4859 24.1846 38.2814C23.4183 39.0769 23.4419 40.343 24.2374 41.1093L33.5512 50.0815C33.9697 50.4847 34.543 50.6859 35.1217 50.6328C35.7005 50.5796 36.2275 50.2773 36.5656 49.8045L51.0018 29.617Z" fill="#54875D"/>
        </svg>
        <Heading level="3" weight={'bolder'} textAlign="center">
         Verification succeeded!
        </Heading>
        <Box style={rewardStyle}>
          <Heading level="3" color={'#6C93EC'} weight={'bolder'}>
            +{rewards} Points
          </Heading>
        </Box>
        <Button
          margin={{top: "medium"}}
          primary
          label={ "Go to my models" }
          style={{
            ...commonButtonStyle,
            backgroundColor: '#6C94EC',
            color: 'white',
          }}
          onClick={() => {
            location.href = `${window.location.origin}/cocreation?showMyModels=1`
          }}
        />
      </Box>
    </Box>
  }

  if(isPending){
    return <Box fill align="center" justify="center">
      <Box
        pad="medium"
        gap="small"
        align="center"
        round="small"
      >
        <Spinner color="black" size="medium" />
        <Heading level="3" weight={'bolder'} textAlign="center">
          {`You have submitted ${contributionIds.length} piece${(contributionIds.length > 1) ? 's' : ''} of knowledge.${isSubmitting ? `${toSubmitted} files are still pending submission.`:''} Upon verification, you will receive up to:`}
        </Heading>
        <Box style={rewardStyle}>
          <Heading level="3" color={'#6C93EC'} weight={'bolder'}>
            + {number *10} Points
          </Heading>
        </Box>
        <Text textAlign="center">
          This process will take approximately 10 minutes to 1 hour
        </Text>
      </Box>
      <Button
        margin={{top: "medium"}}
        primary
        label={"Go to my models" }
        style={{
          ...commonButtonStyle,
          backgroundColor: '#6C94EC',
          color: 'white',
        }}
        onClick={() => {
          location.href = `${window.location.origin}/cocreation?showMyModels=1`
        }}
      />
    </Box>
  }

  if(isFailure){
    return  <Box fill align="center" justify="center">
      <Box
        pad="medium"
        gap="small"
        align="center"
        round="small"
      >
        <svg width="76" height="77" viewBox="0 0 76 77" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M38.5 66.532C54.2401 66.532 67 53.7721 67 38.032C67 22.2919 54.2401 9.53198 38.5 9.53198C22.7599 9.53198 10 22.2919 10 38.032C10 53.7721 22.7599 66.532 38.5 66.532ZM31.9653 27.4667C30.8523 26.3537 29.0477 26.3537 27.9347 27.4667C26.8218 28.5797 26.8218 30.3842 27.9347 31.4972L34.4695 38.032L27.9347 44.5667C26.8218 45.6797 26.8218 47.4842 27.9347 48.5972C29.0477 49.7102 30.8523 49.7102 31.9653 48.5972L38.5 42.0625L45.0347 48.5972C46.1477 49.7102 47.9523 49.7102 49.0653 48.5972C50.1782 47.4842 50.1782 45.6797 49.0653 44.5667L42.5305 38.032L49.0653 31.4972C50.1782 30.3842 50.1782 28.5797 49.0653 27.4667C47.9523 26.3537 46.1477 26.3537 45.0347 27.4667L38.5 34.0015L31.9653 27.4667Z" fill="#B8482B"/>
        </svg>
        <Heading level="3" weight={'bolder'} textAlign="center">
          Verification failed !
        </Heading>
        <div className={'flex flex-col items-center space-y-1'}>
          {validationStatus.map(status=><div className={'flex flex-row'}>
            <div className={'flex flex-row items-center '}>{status.dataValidationStatus==='SUCCESS'? <svg width="24" height="24" viewBox="0 0 76 77" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M37.5 9.45337C21.7614 9.45337 9 22.2148 9 37.9534C9 53.692 21.7614 66.4534 37.5 66.4534C53.2386 66.4534 66 53.692 66 37.9534C66 22.2148 53.2386 9.45337 37.5 9.45337ZM51.0018 29.617C51.6443 28.7185 51.4368 27.4693 50.5384 26.8268C49.6399 26.1843 48.3907 26.3918 47.7482 27.2903L34.6587 45.5944L27.0126 38.2286C26.2171 37.4622 24.951 37.4859 24.1846 38.2814C23.4183 39.0769 23.4419 40.343 24.2374 41.1093L33.5512 50.0815C33.9697 50.4847 34.543 50.6859 35.1217 50.6328C35.7005 50.5796 36.2275 50.2773 36.5656 49.8045L51.0018 29.617Z" fill="#54875D"/>
            </svg>:<svg width="24" height="24" viewBox="0 0 76 77" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M38.5 66.532C54.2401 66.532 67 53.7721 67 38.032C67 22.2919 54.2401 9.53198 38.5 9.53198C22.7599 9.53198 10 22.2919 10 38.032C10 53.7721 22.7599 66.532 38.5 66.532ZM31.9653 27.4667C30.8523 26.3537 29.0477 26.3537 27.9347 27.4667C26.8218 28.5797 26.8218 30.3842 27.9347 31.4972L34.4695 38.032L27.9347 44.5667C26.8218 45.6797 26.8218 47.4842 27.9347 48.5972C29.0477 49.7102 30.8523 49.7102 31.9653 48.5972L38.5 42.0625L45.0347 48.5972C46.1477 49.7102 47.9523 49.7102 49.0653 48.5972C50.1782 47.4842 50.1782 45.6797 49.0653 44.5667L42.5305 38.032L49.0653 31.4972C50.1782 30.3842 50.1782 28.5797 49.0653 27.4667C47.9523 26.3537 46.1477 26.3537 45.0347 27.4667L38.5 34.0015L31.9653 27.4667Z" fill="#B8482B"/>
            </svg>}
            <div>{shortenFilename(toReadablePath(status.filePath))}</div></div>
            {status.dataValidationStatus!=='SUCCESS' && <Tooltip content={status.errorMessage} >
              <Button className={'ml-4'}>&nbsp;&nbsp;ⓘ</Button>
            </Tooltip>}
          </div>)}
        </div>
        <Box style={rewardStyle}>
          <Heading level="3" color={'#6C93EC'} weight={'bolder'}>
            +{0} Points
          </Heading>
        </Box>
        <Button
          margin={{top: "medium"}}
          primary
          label={  "Recreate"}
          style={{
            ...commonButtonStyle,
            backgroundColor: '#6C94EC',
            color: 'white',
          }}
          onClick={() => {
              setShowLoadingModal(false);
          }}
        />
      </Box>
    </Box>
  }

  return (
    <Box fill align="center" justify="center">
      <Box
        pad="medium"
        gap="small"
        align="center"
        round="small"
      >
        <Heading level="3" >
          Verification Status
        </Heading>
        <div className={'flex flex-col items-center space-y-1'}>
          {validationStatus.map(status=><div className={'flex flex-row'}>
            <div className={'flex flex-row items-center '}>{status.dataValidationStatus==='SUCCESS'? <svg width="24" height="24" viewBox="0 0 76 77" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M37.5 9.45337C21.7614 9.45337 9 22.2148 9 37.9534C9 53.692 21.7614 66.4534 37.5 66.4534C53.2386 66.4534 66 53.692 66 37.9534C66 22.2148 53.2386 9.45337 37.5 9.45337ZM51.0018 29.617C51.6443 28.7185 51.4368 27.4693 50.5384 26.8268C49.6399 26.1843 48.3907 26.3918 47.7482 27.2903L34.6587 45.5944L27.0126 38.2286C26.2171 37.4622 24.951 37.4859 24.1846 38.2814C23.4183 39.0769 23.4419 40.343 24.2374 41.1093L33.5512 50.0815C33.9697 50.4847 34.543 50.6859 35.1217 50.6328C35.7005 50.5796 36.2275 50.2773 36.5656 49.8045L51.0018 29.617Z" fill="#54875D"/>
            </svg>:<svg width="24" height="24" viewBox="0 0 76 77" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fillRule="evenodd" clipRule="evenodd" d="M38.5 66.532C54.2401 66.532 67 53.7721 67 38.032C67 22.2919 54.2401 9.53198 38.5 9.53198C22.7599 9.53198 10 22.2919 10 38.032C10 53.7721 22.7599 66.532 38.5 66.532ZM31.9653 27.4667C30.8523 26.3537 29.0477 26.3537 27.9347 27.4667C26.8218 28.5797 26.8218 30.3842 27.9347 31.4972L34.4695 38.032L27.9347 44.5667C26.8218 45.6797 26.8218 47.4842 27.9347 48.5972C29.0477 49.7102 30.8523 49.7102 31.9653 48.5972L38.5 42.0625L45.0347 48.5972C46.1477 49.7102 47.9523 49.7102 49.0653 48.5972C50.1782 47.4842 50.1782 45.6797 49.0653 44.5667L42.5305 38.032L49.0653 31.4972C50.1782 30.3842 50.1782 28.5797 49.0653 27.4667C47.9523 26.3537 46.1477 26.3537 45.0347 27.4667L38.5 34.0015L31.9653 27.4667Z" fill="#B8482B"/>
            </svg>}
              <div>{shortenFilename(toReadablePath(status.filePath))}</div></div>
            {status.dataValidationStatus!=='SUCCESS' && <Tooltip content={status.errorMessage} >
              <Button className={'ml-4'}>&nbsp;&nbsp;ⓘ</Button>
            </Tooltip>}
          </div>)}
        </div>
        <Box style={rewardStyle}>
          <Heading level="3" color={'#6C93EC'} weight={'bolder'}>
            +{ rewards } Points
          </Heading>
        </Box>
        <Button
            margin={{top: "medium"}}
            primary
            label={ "Recreate"}
            style={{
              ...commonButtonStyle,
              backgroundColor: '#6C94EC',
              color: 'white',
            }}
            onClick={() => {
                setShowLoadingModal(false);
            }}
          />
      </Box>
    </Box>
    
  );
};

interface ContributionProps {
  model: Model;
}

interface FileValidation{
  dataValidationStatus:string
  contributionId:string
  filePath:string,
  errorMessage:string
}

export const Contribution = ({ model }: ContributionProps) => {
  const { address } = useAccount();
  const { isConnected, handleConnect } = useConnectWallet();
  const [files, setFiles] = useState<File[]>([]);
  const [localWindow, setWindow] = useState<Window>();
  const [loading, setLoading] = useState(false);
  const [dataContributionIds, setDataContributionIds] = useState<string[]>([]);
  const [sampleContributions, setSampleContributions] = useState<DataContribution[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [validationStatus, setValidationStatus] = useState<FileValidation[]>([]);
  const [currentPreview, setCurrentPreview] = useState<number>(0);
  const [rewards, setRewards] = useState<number>(0);
  const ref = useRef();
  const handleEvent = (data: any) => {
    const {dataValidationStatus,contributionId,filePath,errorMessage}=data.detail
    handleNotificationMessage({dataValidationStatus,contributionId,filePath,errorMessage}).then();
  };
  const handleRewardUpdate = (data: any) => {
    const {rewardAmount}=data.detail
    setRewards(reward=>reward+rewardAmount)
  };
  useEventListener(NOTIFICATION_TYPE_CONTRIBUTION_VERIFIED, handleEvent,localWindow);
  useEventListener(NOTIFICATION_TYPE_REWARD_UPDATED, handleRewardUpdate,localWindow);
  useEffect(() => {
    setWindow(window);
  }, []);

  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const loadSuccessfulContributions = async () => {
    try {
      const res = await fetch(
        `/api/rag/listDataContributions?modelId=${model.id}&&skipRecords=0&status=${'SUCCESS'}`
      );
      const data = await res.json();
      setSampleContributions(data?.slice(0,3));
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    loadSuccessfulContributions().then()
  }, [model]);

  const checkVerificationResult = async (
    modelId: string,
    contributionID: string,
    fileName: string
  ) => {
    await fetch(`/api/rag/verifyContributionToMlBackend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modelId,
        contributionID,
        fileName,
      }),
    });
  };

  const handleComplete = async () => {
    setDataContributionIds([]);
    setShowLoadingModal(true);
    if (!isConnected) {
      handleConnect();
      return;
    }
    try {
      setValidationStatus([]);
      setRewards(0);
      setLoading(true);

      const newFileNames=Array(files.length).fill(null)
      const innerContributionIds=[]

      for(let i=0;i<files.length;i++){
        const file = files[i]
        const reponseFromUpload = await fetch('../api/rag/upload', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename: file.name,
          }),
        });

        const dataFromUpload = await reponseFromUpload.json();
       
        if (!reponseFromUpload.ok) {
          console.error(
            'Error uploading file to S3:',
            dataFromUpload.message
          );
          continue
        }
               
        const url = dataFromUpload.url;
        const fields = dataFromUpload.fields;
        newFileNames[i]=fields.key

        const formDataForS3 = new FormData();
        Object.keys(fields).forEach((key) => {
          formDataForS3.append(key, fields[key]);
        });
        formDataForS3.append('file', file);

        const responseFromS3 = await fetch(url, {
          method: 'POST',
          body: formDataForS3,
        });

        if (!responseFromS3.ok) {
          console.error('Error uploading file to S3:', responseFromS3);
          continue
        }

        const formDataForContribution = new FormData();
        formDataForContribution.append(
          'userId',
          (address as string)?.toLocaleLowerCase()
        );
        formDataForContribution.append('modelId', model.id);
        formDataForContribution.append('filePath', fields.key);
        const responseFromContribution  = await fetch(
          '../api/rag/postContribution',
          {
            method: 'POST',
            body: formDataForContribution,
          }
        );
        const dataFromContribution = await responseFromContribution.json();
        innerContributionIds.push(dataFromContribution.dataContribution.id)
      }
      setDataContributionIds(innerContributionIds)

      for(let i=0;i<files.length;i++){
        const newFileNameInS3 = newFileNames[i]
        const contributionId=innerContributionIds[i]
        console.log(
          'Contribution added successfully',
          contributionId
        );
        await sleep(3000*Math.random())
        await checkVerificationResult(
          model.id,
          contributionId,
          newFileNameInS3
        )
      }
    } catch (error) {
      console.log('Error:', error);
    } finally {
      setFiles([]);
      setLoading(false);
    }
  };

  const handleNotificationMessage = async (fileValidation:FileValidation) => {
    try {
        setValidationStatus([...validationStatus,fileValidation])
    } catch (error) {
      console.log('Error:', error);
    }
  };
  
  return (
    // @ts-ignore
    <div ref={ref}>
      {showPreview && (
        <Layer responsive={true} background={{ opacity: 'weak' }} full={true} margin={{top: "medium"}}>
          <Box
            background="white"
            width="large"
            height="large"
            pad={{ horizontal: 'medium', bottom: 'medium', top: 'small' }}
            gap="small"
            round="medium"
            alignSelf="center"
          >
            <Button
              icon={<svg width="25" height="25" viewBox="0 0 25 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M12.5 22.6191C18.023 22.6191 22.5 18.1421 22.5 12.6191C22.5 7.09614 18.023 2.61914 12.5 2.61914C6.977 2.61914 2.5 7.09614 2.5 12.6191C2.5 18.1421 6.977 22.6191 12.5 22.6191Z" stroke="#879095" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
              <path d="M9.05798 9.34961L15.942 16.2336" stroke="#879095" stroke-width="2" stroke-linecap="round"/>
              <path d="M15.942 9.34961L9.05797 16.2336" stroke="#879095" stroke-width="2" stroke-linecap="round"/>
              </svg>
              }
              onClick={() => setShowPreview(false)}
              alignSelf="end"
              plain
            />
            <Box>
                <Heading level="3" margin="none">Knowledge #{currentPreview+1}</Heading>
                <Text>{isFilePathLink(sampleContributions[currentPreview]?.filePath) ? 'Link':'File name'} : {shortenFilename(toReadablePath(sampleContributions[currentPreview]?.filePath))}</Text>
            </Box>
            <KnowledgePreview filePath={sampleContributions[currentPreview]?.filePath} height="100%" />
            <Box fill="horizontal" align="center" justify="center" direction="row" gap="medium">
              <SecondaryButton
                  pad={{horizontal: "medium", vertical: "small"}}
                  label="Previous"
                  icon={<LinkPrevious />}
                  disabled={currentPreview === 0}
                  onClick={() => setCurrentPreview(currentPreview - 1)}
              />
              <PrimaryButton
                  pad={{horizontal: "medium", vertical: "small"}}
                  label="Next" icon={<LinkNext />}
                  reverse={true}
                  disabled={currentPreview === sampleContributions.length - 1}
                  onClick={() => setCurrentPreview(currentPreview + 1)}
              />
            </Box>
          </Box>
        </Layer>
      )}
      {showLoadingModal && (
        <Layer responsive={true} background={{ opacity: 'weak' }} full={true} margin={{top: "large"}}>
          <Box
            background="white"
            width="30%"
            pad={{ horizontal: 'medium', bottom: 'medium', top: 'small' }}
            gap="small"
            round="medium"
            alignSelf="center"
          >
            <Box alignSelf="end" onClick={() => setShowLoadingModal(false)}>
              <Close />
            </Box>
            <ReceiveRewardsPage
              filesNumber={files.length}
              modelId={model.id}
              contributionIds={dataContributionIds}
              validationStatus={validationStatus}
              fileName={files[0]?.name}
              rewards={rewards}
              setShowLoadingModal={setShowLoadingModal}
            />
          </Box>
        </Layer>
      )}
      <Box background="white" pad="32px" round="medium" gap="medium" overflow="auto">
        <div>
          <h2 className="text-lg font-extrabold">Contribute knowledge</h2>
          <p className="text-sm leading-4 font-medium">Contribute to the knowledge base of the agent and you can earn up to 100 points every 24 hours.</p>
        </div>
        <Box gap="small">
          <Box direction="row" align="center" justify="between" gap="small">
            {sampleContributions?.map((_, index) => (
              <div key={index} className="flex flex-row rounded-lg bg-white p-3 border-[#6C93EC] border-2 justify-between">
                <div>
                  <img src="/static/images/cocreation/Document.svg" alt="document" />
                </div>
                <div className="font-semibold text-end xl:w-3/5">
                  <p className="text-base leading-5">Knowledge example#{index+1}</p>
                  <button className="text-sm text-[#6C93EC]" onClick={() => {setCurrentPreview(index); setShowPreview(true)}}>
                    Preview
                  </button>
                </div>
              </div>
            ))}
          </Box>
          <ContentUpload files={files} setFiles={setFiles} />
          {files.length > 0 &&
            <Box pad="small">
              <PrimaryButton
                alignSelf='end'
                label="Submit"
                onClick={handleComplete}
                disabled={files.length === 0}
                busy={loading}
              />            
            </Box>
          }
        </Box>
      </Box>
    </div>
  );
};
