import { ReCaptchaPageView } from '../components/ReCaptchaPageView';
import TaskCenter from '../components/RAG/TaskCenter';
import { Layout } from '../components';
import { Box, Button } from 'grommet';
import Leaderboard from '../components/RAG/Leaderboard';
import QuestContextProvider from '../context/questContext';
import MyPoint from "@/src/components/RAG/MyPoint";

export default function PointsPage() {

    return(
        <>
        <ReCaptchaPageView />
        <QuestContextProvider>
            <Layout>
                <Box justify="center" gap="medium" fill="horizontal" alignSelf="center" background="white">
                    <div className="bg-white w-full py-12 flex justify-center">
                        <div className={'w-5/6 flex flex-col md:flex-row justify-between'}>
                            <div>
                                <div className="space-y-3 text-black">
                                    <h1 className="text-4xl font-semibold">Earn points and gain rewards</h1>
                                    <p className="text-lg font-normal w-4/5">The platform where the machine learning community collaborates on models, datasets, and applications.</p>
                                </div>
                                <div className='flex flex-row space-x-10 py-10'>
                                <Button
                                    primary
                                    label="Earn Points"
                                    pad={{ horizontal: 'large', vertical: 'small' }}
                                    href='/cocreation'
                                />
                                </div>
                            </div>
                            <div className={'mr-12'}>
                                <MyPoint/>
                            </div>
                        </div>
                    </div>
                </Box>
                <Box justify="center" gap="medium" width="83.3%" alignSelf="center">
                    <div className="pl-1 pt-12" style={{ marginBottom: '20px' }}>
                        <div>
                            <h3 className="text-2xl font-extrabold text-black">Task Center</h3>
                            <TaskCenter />
                        </div>
                    </div>
                    <div className="pl-1">
                        <div>
                        <Leaderboard />
                        </div>
                    </div>
                </Box>
            </Layout>
        </QuestContextProvider>
        </>
    );
}


