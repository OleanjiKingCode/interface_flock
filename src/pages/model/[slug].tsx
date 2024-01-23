import { Layout, PrimaryButton } from '@/src/components';
import { Contribution } from '@/src/components/RAG/Contribution';
import { ModelDescription } from '@/src/components/RAG/ModelDescription';
import { PreviewAndVote } from '@/src/components/RAG/PreviewAndVote';
import { Box, Button, Layer} from 'grommet';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FLockBoard } from '@/src/components/RAG/FLockBoard';
import { Close } from 'grommet-icons';
import MultiChatPanel from '@/src/components/RAG/MultiChatPanel';
import PlainMultiChatPanel from '@/src/components/RAG/PlainMultiChatPanel';
import { useConnectWallet } from '@/src/hooks/useConnectWallet';


function ChatTab({ model }: { model: any}) {
  const { isConnected, handleConnect } = useConnectWallet();
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  return (
    <div>
      { isChatOpen && (
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
              onClick={() => setIsChatOpen(false)}
              alignSelf="end"
              plain
            />
            <PlainMultiChatPanel model={model} />
          </Box>
        </Layer>
      )}
      <div className="flex flex-row justify-between p-8 items-center bg-white rounded-3xl">
        <div className="w-1/2">
          <h2 className="text-lg font-extrabold">Test the model</h2>
          <p className="text-sm leading-4 font-medium">Enjoy ten free interactions with our chatbot to assess its capabilities.</p>
        </div>
        <PrimaryButton
          label="Chat"
          onClick={() => isConnected ? setIsChatOpen(true) : handleConnect()}
          pad={{ horizontal: 'large' }}
        />
      </div>
    </div>
  )
}

export default function RAGTasksPage() {
  const router = useRouter();
  const { slug: taskAddress } = router.query;
  const [modelData, setModelData] = useState<any>({});
  const [modelId, setModelId] = useState<string>('');

  // Hook to get the task data using task address
  // or
  // Fetch modelData from db
  const getModelData = async (modelId: string) => {
    const res = await fetch(`/api/rag/getModel?modelId=${modelId}`);
    const data = await res.json();
    if (data.error) {
      console.log(data.error);
      return;
    }
    setModelData(data);
  };

  useEffect(() => {
    if (!taskAddress) return;
    setModelId(taskAddress as string);
    getModelData(taskAddress as string);
  }, [taskAddress]);

  return (
    <Layout>
      <Box width="100%" gap="large" justify="center" align="center">
        <Box
          justify="start"
          width="83.3%"
          pad={{ vertical: 'large' }}
          gap="medium"
        >
          <Box gap="large" width="100%">
            <ModelDescription modelData={modelData} />
            <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-10 lg:space-y-0">
              <div className="lg:w-2/5">
                {modelId && <FLockBoard modelId={modelId}/>}
              </div>
              <div className="space-y-4 lg:w-3/5">
                <Contribution model={modelData}  />
                <ChatTab model={modelData} />
              </div>
            </div>
            <PreviewAndVote modelId={modelId} modelName={modelData?.modelName}/>
          </Box>
        </Box>
      </Box>
    </Layout>
  );
}
