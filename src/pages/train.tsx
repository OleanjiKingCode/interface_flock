import {
  Box,
  Heading,
  Layer,
  Menu,
  TextInput,
  Text,
  ResponsiveContext,
} from 'grommet';
import { CreateTask, Layout, PrimaryButton, SecondaryButton, Tasks } from '../components';
import { useState, useContext } from 'react';
import { AppsRounded, Money, Java, Image, Gamepad, CheckboxSelected, Search } from 'grommet-icons';
import { useAccount } from 'wagmi';
import { MyModels } from '../components/RAG/MyModels';

const defaultCardColor = "#6C94EC";

export default function TrainPage() {
  const [showCreateTask, setShowCreateTask] = useState(false);
  const [showMyModels, setShowMyModels] = useState(false);
  const [numberOfTasks, setNumberOfTasks] = useState(0);
  const size = useContext(ResponsiveContext);
  const [filterType, setFilterType] = useState<string[]>([]);
  const [filterProgressStatus, setFilterProgressStatus] = useState<string[]>([]);

  const updateFilterType = (selectedTypes: string[]) => {
    setFilterType(selectedTypes);
  };
  
  const updateFilterProgressStatus = (selectedStatuses: string[]) => {
    setFilterProgressStatus(selectedStatuses);
  };

  const handleFilterTypeClick = (item: string) => {

    let updatedFilterType: string[];
  
    if (item === 'All') {
      updatedFilterType = [];
    } else if (filterType.includes(item)) {
      updatedFilterType = filterType.filter((f) => f !== item);
    } else {
      updatedFilterType = [...filterType, item];
    }
  
    updateFilterType(updatedFilterType);
  };

  const handleFilterProgressStatusClick = (item: string) => {

    let updatedFilterProgressStatus: string[];
  
    if (item === 'All') {
      updatedFilterProgressStatus = [];
    } else if (filterProgressStatus.includes(item)) {
      updatedFilterProgressStatus = filterProgressStatus.filter((f) => f !== item);
    } else {
      updatedFilterProgressStatus = [...filterProgressStatus, item];
    }
  
    updateFilterProgressStatus(updatedFilterProgressStatus);
  };

  const isAllTypesSelected = filterType.length === 0;

  const isAllStatusSelected = filterProgressStatus.length === 0;

  const { isDisconnected } = useAccount();

  return (
    <Layout>
      <Box direction="row-responsive" width="100%">
        <Box basis="1/4" background="#EEEEEE" pad={{ horizontal: size === 'large' ? 'xlarge' : 'medium', bottom: 'large' }}>
          <Box gap="small">
              <Box margin={{ vertical: 'small'}}>
              <PrimaryButton
                onClick={() => setShowCreateTask(true)}
                disabled={isDisconnected}
                margin={{ top: 'large' }}
                label="Create New"
                size="medium"
                pad={{ vertical: 'small', horizontal: 'large' }}
              />
            </Box>
            <Heading level="3">Theme</Heading>
              <Box
                  border={{ color: 'black', size: 'small' }}
                  round="small"
                  pad="xsmall"
                  background={isAllTypesSelected ? defaultCardColor : ''}
                  direction="row"
                  gap="small"
                  align="center"
                  onClick={() => handleFilterTypeClick('All')}
                >
                <AppsRounded color="black" size="20px" /><Text weight="bold">All</Text>
              </Box>
              <Box
                  border={{ color: 'black', size: 'small' }}
                  round="small"
                  pad="xsmall"
                  background={ filterType.includes('DeFi') ? defaultCardColor : ''}
                  direction="row"
                  gap="small"
                  align="center"
                  onClick={() => handleFilterTypeClick('DeFi')}
                >
                <Money color="black" size="20px" /><Text weight="bold">DeFi</Text>
              </Box>
              <Box
                  border={{ color: 'black', size: 'small' }}
                  round="small"
                  pad="xsmall"
                  background={ filterType.includes('Social') ? defaultCardColor : ''}
                  direction="row"
                  gap="small"
                  align="center"
                  onClick={() => handleFilterTypeClick('Social')}
                >
                <Java color="black" size="20px" /><Text weight="bold">Social</Text>
              </Box>
              <Box
                  border={{ color: 'black', size: 'small' }}
                  round="small"
                  pad="xsmall"
                  background={ filterType.includes('NFT') ? defaultCardColor : ''}
                  direction="row"
                  gap="small"
                  align="center"
                  onClick={() => handleFilterTypeClick('NFT')}
                >
                <Image color="black" size="20px" /><Text weight="bold">NFT</Text>
              </Box>
              <Box
                  border={{ color: 'black', size: 'small' }}
                  round="small"
                  pad="xsmall"
                  background={ filterType.includes('Gaming') ? defaultCardColor : ''}
                  direction="row"
                  gap="small"
                  align="center"
                  onClick={() => handleFilterTypeClick('Gaming')}
                >
                <Gamepad color="black" size="20px" /><Text weight="bold">Gaming</Text>
              </Box>
            <Heading level="3">Status</Heading>
              <Box
                    border={{ color: 'black', size: 'small' }}
                    round="small"
                    pad="xsmall"
                    background={isAllStatusSelected ? defaultCardColor : ''}
                    direction="row"
                    gap="small"
                    align="center"
                    onClick={() => handleFilterProgressStatusClick('All')}
                  >
                  <CheckboxSelected color="black" size="20px" /><Text weight="bold">All</Text>
                </Box>
                <Box
                    border={{ color: 'black', size: 'small' }}
                    round="small"
                    pad="xsmall"
                    background={ filterProgressStatus.includes('available') ? defaultCardColor : ''}
                    direction="row"
                    gap="small"
                    align="center"
                    onClick={() => handleFilterProgressStatusClick('available')}
                  >
                  <CheckboxSelected color="black" size="20px" /><Text weight="bold">Available to join</Text>
                </Box>
                <Box
                    border={{ color: 'black', size: 'small' }}
                    round="small"
                    pad="xsmall"
                    background={ filterProgressStatus.includes('inProcess') ? defaultCardColor : ''}
                    direction="row"
                    gap="small"
                    align="center"
                    onClick={() => handleFilterProgressStatusClick('inProcess')}
                  >
                  <CheckboxSelected color="black" size="20px" /><Text weight="bold">In process</Text>
                </Box>
                <Box
                    border={{ color: 'black', size: 'small' }}
                    round="small"
                    pad="xsmall"
                    background={ filterProgressStatus.includes('completed') ? defaultCardColor : ''}
                    direction="row"
                    gap="small"
                    align="center"
                    onClick={() => handleFilterProgressStatusClick('completed')}
                  >
                  <CheckboxSelected color="black" size="20px" /><Text weight="bold">Completed</Text>
                </Box>
          </Box>
        </Box>
        <Box basis="3/4">
          <Box 
              direction="row-responsive" 
              align="center"
              justify="between"
              pad={{ top: 'large', bottom: 'small', horizontal: 'large'}}
          >
              <Box direction="row-responsive" gap="large">
                  <Box direction="row" alignSelf="end" gap="xsmall"><Text weight='bold'>Models</Text>{numberOfTasks}</Box>
                  <TextInput
                  placeholder="Search"
                  icon={<Search />}
                  ></TextInput>
              </Box>
              <Box>
                { size === "large" &&
                  <Menu plain label="Sort by" items={[]} color="#9E9E9E" />
                }
              </Box>
          </Box>
          <Box pad={{ horizontal: 'large'}} align="center">
          <Tasks
            setNumberOfTasks={setNumberOfTasks}
            filterItems={{
              taskTypes: filterType,
              progressStatus: filterProgressStatus,
            }}
            updateFilterType={updateFilterType}
            updateFilterProgressStatus={updateFilterProgressStatus}
          />
          </Box>
        </Box>
      </Box>
      {showCreateTask && (
        <Layer responsive={true}>
          <CreateTask setShowCreateTask={setShowCreateTask} />
        </Layer>
      )}
    </Layout>
  );
}
