import { ReCaptchaPageView } from "../components/ReCaptchaPageView";
import TaskCenter from "../components/RAG/TaskCenter";
import { Layout } from "../components";
import { Box, Button } from "grommet";
import Leaderboard from "../components/RAG/Leaderboard";
import QuestContextProvider from "../context/questContext";
import MyPoint from "@/src/components/RAG/MyPoint";

export default function PointsPage() {


    return(
        <>
        <ReCaptchaPageView />
        <QuestContextProvider>
            <Layout>
            <Box justify="center" gap="medium" fill="horizontal" alignSelf="center" background="white">
                <div className="bg-white w-full py-12 flex justify-center">
                    <div className="w-full md:w-5/6 flex flex-col md:flex-row justify-center md:justify-between items-center text-center md:text-left">
                    <div className="mb-6 md:mb-0 md:mr-12 px-4 md:px-0"> 
                        <div className="space-y-3 text-black">
                        <h1 className="text-4xl font-semibold">Earn points and gain rewards</h1>
                        <p className="text-lg font-normal mx-4 md:mx-0 text-center md:text-left">
                            Earn as you innovate: Co-create and Contribute to collect points and unlock exclusive rewards
                        </p>
                        </div>
                        <div className='flex flex-col md:flex-row justify-center md:justify-start items-center md:items-start space-y-6 md:space-y-0 md:space-x-10 py-10'>
                        <Button
                            primary
                            label="Earn Points"
                            pad={{ horizontal: 'large', vertical: 'small' }}
                            href='/cocreation'
                        />
                        </div>
                    </div>
                    <div>
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
