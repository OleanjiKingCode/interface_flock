import { Layout } from '../components';
import {
  Box,
  Heading,
} from 'grommet';
import { Key, useEffect, useState, useContext, createContext } from 'react';
import {
  useAccount,
  useContractRead,
  useContractWrite,
  useWaitForTransaction,
} from 'wagmi';
import { useCreditsData } from '../hooks/useCreditsData';
import { WalletContext } from '../context/walletContext';
import { event } from 'nextjs-google-analytics';
import { Instructions } from '../components/Researcher/Instructions';
import { Research } from '../components/Researcher/Research';
import { Reports } from '../components/Researcher/Reports';
import { Logo } from '../components/Researcher/Logo';
import { ReportOutput } from '../components/Researcher/ReportOutput';
import { createClient } from '@supabase/supabase-js'
import { FLOCK_NFT_ABI } from '../contracts/flockNFT';
import { useIsMounted } from '../hooks';
        
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_ANON_KEY as string,
)

type ReportProps = {
  reportType: string;
  reportTitle: string;
  reportLink: string;
}

export default function GptResearcherPage() {
  const mounted = useIsMounted();
  const { address } = useAccount();
  const [report, setReport] = useState<string>('');
  const [reportType, setReportType] = useState({
    label: 'Research Report',
    value: 'research_report',
  });
  const [task, setTask] = useState<string>('');
  const [agentOutput, setAgentOutput] = useState<string[]>([]);
  const [downloadLink, setDownloadLink] = useState<string>('');
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isLoadingReport, setIsLoadingReport] = useState<boolean>(false);
  const [isResearching, setIsResearching] = useState<boolean>(false);
  const [userNFTs, setUserNFTs] = useState<NFT[]>([]);
  const [showVoteComplete, setShowVoteComplete] = useState<boolean>(false);

  interface NFT {
    name: string;
  }

  const nftImages: { [key: string]: string } = {
    NewsAgent: 'NewsNFT.png',
    MathsAgent: 'MathsNFT.png',
    PhysicistAgent: 'PhysicistNFT.png',
    FinancialAnalystAgent: 'FinAnalystNFT.png',
    RealEstateAgent: 'RealEstateNFT.png',
    UnknownNFT: 'UnknownNFT.png',
  };

  const agentLabels = [
    'News Agent',
    'Maths Agent',
    'Physicist Agent',
    'Financial Analyst Agent',
    'Real Estate Agent',
  ];

  const getNFTImage = (nftName: string): string => {
    return nftImages[nftName] || nftImages['UnknownNFT'];
  };

  const maxNFTs = 5;

  const [loadedReports, setLoadedReports] = useState<ReportProps[]>([]);

  const { userToken, publicKey } = useContext(WalletContext);

  const { userData, researchPrice, isWhitelisted, voterToAgentName } =
    useCreditsData({
      userAddress: address,
    });

  const [prediction, setPrediction] = useState(
    voterToAgentName // camelCase to Sentence Case
  );

  async function getReports() {

    const reports : ReportProps[] = [];

    agentLabels.forEach(async (agentLabel) => {

      const { data, error } = await supabase.storage.from('researcher-reports').list(address + '/' + agentLabel, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'name', order: 'asc' },
      });
      if (data?.length === 0 || error) {
        return;
      }
      reports.push({
        reportType: "Research Report",
        reportTitle: "Research",
        reportLink: data[0].name,
      });
    })
    setLoadedReports(reports);
  }

  useEffect(() => {
    if (address) {
      setIsConnected(true);
      getReports();
    } else {
      setIsConnected(false);
    }
  }, [address]);

  const GPTResearcher = (() => {
    const startResearch = () => {
      setIsResearching(true);
      addAgentResponse({
        output:
          '🤔 Too many requests right now, you are in the queue, please be patient.',
      });

      listenToSockEvents();
    };

    const listenToSockEvents = () => {
      const ws_uri = `${process.env.NEXT_PUBLIC_RESEARCHER_WEB_SOCKET_URL}?token=${userToken}&authKey=${publicKey}`;
      const socket = new WebSocket(ws_uri);
      socket.onmessage = (event) => {
        const data = JSON.parse(event.data);
        if (data.type === 'logs') {
          addAgentResponse(data);
        } else if (data.type === 'report') {
          writeReport(data);
        } else if (data.type === 'path') {
          updateDownloadLink(data);
        }
      };

      socket.onopen = (e) => {
        const requestData = {
          task: task,
          report_type: reportType.value,
          agent: 'Auto Agent',
          walletAddress: address,
        };

        event('submit_form_generate_report', requestData);
        socket.send(`start ${JSON.stringify(requestData)}`);
      };
    };

    const addAgentResponse = (data: { output: any }) => {
      setAgentOutput((prev) => [...prev, data.output]);
    };

    const writeReport = (data: { output: any }) => {
      setReport((prev) => prev + data.output);
    };

    const updateDownloadLink = (data: { output: any }) => {
      const position = data.output.search('/output');
      const link = 'https://researcher.flock.io' + data.output.slice(position);
      setDownloadLink(link);
      getReports();
      setIsResearching(false);
    };

    return {
      startResearch,
    };
  })();

  const handleSubmit = () => {
    setReport('');
    setDownloadLink("");
    setAgentOutput([]);
    GPTResearcher.startResearch();
  };

  const { data: NFTData } = useContractRead({
    address: process.env.NEXT_PUBLIC_FLOCK_CREDITS_ADDRESS as `0x${string}`,
    abi: FLOCK_CREDITS_ABI,
    functionName: 'checkNFT',
    args: [address],
    watch: true,
  });

  const {
    data: vote,
    write: writeVote,
    isLoading: voteLoading,
  } = useContractWrite({
    address: process.env.NEXT_PUBLIC_FLOCK_NFT_ADDRESS as `0x${string}`,
    abi: FLOCK_NFT_ABI,
    functionName: 'vote',
  });

  const { isSuccess: isSuccessVote, isLoading: isVoteTxLoading } =
    useWaitForTransaction({
      hash: vote?.hash,
    });

  useEffect(() => {
    if (NFTData && (NFTData as NFT[]).length > 0) {
      setUserNFTs(NFTData as NFT[]);
    } else {
      setUserNFTs([]);
    }
  }, [NFTData]);

  const handlePurchase = () => {
    writePurchaseCredits?.({ args: [amount] });
  };

  const handlePrediction = (agent: string) => {
    if (agent === prediction) {
      setPrediction('');
      return;
    }
    setPrediction(agent);
  };

  useEffect(() => {
    setReport('');
    setTask('');
  }, [reportType]);

  useEffect(() => {
    if (isSuccessVote) {
      setShowVoteComplete(true);
    }
  }, [isSuccessVote]);

  if (!mounted) {
    return <></>;
  }

  return (
    <Layout>
      <Box width="100%" gap="large" align="center" background="#F8FAFB">
        <Box
          background="#F8FAFB"
          align="center"
          justify="center"
          width="70%"
          pad={{ vertical: 'large', horizontal: 'large' }}
          gap="medium"
          round="small"
          margin={{ vertical: 'large' }}
        >
          <Logo />
          <Instructions />
          {isConnected ? (
            <>
              <Research 
                isResearching={isResearching}
                task={task}
                reportType={reportType}
                setTask={setTask}
                setReportType={setReportType}
                handleSubmit={handleSubmit}
              />
              { reportType.value === "outline_report" ? (
                <ReportOutput
                  report={report}
                  isResearching={isResearching}
                />
              ) : (
                <>
                  <Reports 
                    supabase={supabase}
                    userAddress={address}
                    reports={loadedReports}
                  />
                  <Box>
                    <Heading level="2" margin="xsmall">
                      Step2: Claim your NFT
                    </Heading>
                    <Text>
                      For each completed use that generates a report, you can unlock
                      and receive one of the NFTs listed below.
                    </Text>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      {filledNFTs.map((nft, index) => (
                        <div
                          key={index}
                          style={{ margin: '10px', textAlign: 'center' }}
                        >
                          <Image
                            src={getNFTImage(nft.name)}
                            alt={nft.name}
                            style={{ width: '120px', height: '120px' }}
                          />
                          <div style={{ marginTop: '5px', fontSize: '12px' }}>
                            {agentLabels[index]}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Box>
                  <Box gap="medium">
                    <Box>
                      <Heading level="2" margin="xsmall">
                        Step3: Make your Prediction
                      </Heading>
                      <Text>
                        Predict the LLM agent that FLock Researcher V2.0 utilises,
                        then split the winnings!
                      </Text>
                    </Box>
                    <Box gap="medium">
                      <Box align="center" justify="center" gap="medium">
                        <Box gap="small" align="center">
                          <Image
                            src={getNFTImage(prediction)}
                            alt={prediction}
                            style={{ width: '120px', height: '120px' }}
                          />
                          <Text>
                            {prediction?.replace(/([A-Z]+)*([A-Z][a-z])/g, '$1 $2')}
                          </Text>
                        </Box>
                        <Box
                          direction="row-responsive"
                          gap="large"
                          width="large"
                          wrap
                          align="center"
                          justify="center"
                        >
                          {agentLabels.map((label, index) => {
                            const claimed =
                              userNFTs.find(
                                (nft) => nft.name === label?.replaceAll(' ', '')
                              ) !== undefined;
                            const selected =
                              prediction === label?.replaceAll(' ', '');
                            const voted =
                              voterToAgentName === label?.replaceAll(' ', '');
                            return (
                              <Box
                                border={
                                  (claimed && voterToAgentName === '') || voted
                                    ? { color: 'black' }
                                    : { color: '' }
                                }
                                round
                                pad="medium"
                                align="center"
                                justify="center"
                                key={index}
                                margin={{ vertical: 'small' }}
                                hoverIndicator={
                                  claimed && voterToAgentName === ''
                                    ? '#6C94EC'
                                    : false
                                }
                                background={
                                  voted
                                    ? '#6C94EC'
                                    : claimed
                                    ? selected
                                      ? '#6C94EC'
                                      : ''
                                    : ''
                                }
                                onClick={() =>
                                  claimed && voterToAgentName === ''
                                    ? handlePrediction(label?.replaceAll(' ', ''))
                                    : {}
                                }
                              >
                                <Text color={claimed || voted ? 'black' : ''}>
                                  {label}
                                </Text>
                              </Box>
                            );
                          })}
                        </Box>
                      </Box>
                      {voterToAgentName === '' && (
                        <Box direction="row" align="center" justify="end">
                          <Button
                            label="Confirm"
                            disabled={!prediction || voteLoading}
                            busy={voteLoading}
                            onClick={() =>
                              prediction && writeVote({ args: [prediction] })
                            }
                          />
                        </Box>
                      )}
                      {showVoteComplete && (
                        <Layer>
                          <Box
                            pad="large"
                            align="center"
                            justify="center"
                            gap="medium"
                          >
                            <Box width="small" height="small">
                              <Image src="voteDone.png" />
                            </Box>
                            <Box align="center" justify="center" width="medium">
                              <Heading level="4" textAlign="center">
                                You have submitted your prediction successfully
                              </Heading>
                              <Text textAlign="center">
                                The FLock Agent Specialist NFT will be airdropped to
                                your wallet within 24 hours!
                              </Text>
                            </Box>
                            <Box>
                              <Button
                                label="Got it!"
                                onClick={() => setShowVoteComplete(false)}
                              />
                            </Box>
                          </Box>
                        </Layer>
                      )}
                    </Box>
                  </Box>
                </>
              )}
            </>
          ) : (
            <Heading level="2" margin="xsmall">
              Connect your wallet to continue
            </Heading>
          )}
        </Box>
      </Box>
    </Layout>
  );
}
