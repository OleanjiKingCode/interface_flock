import { Box, Heading, Text, Image } from "grommet";
import {
  Layout,
  PrimaryButton,
  SecondaryButton,
  TasksForHome,
} from "../components";
import { useState } from "react";
import { CarouselComponent } from "../components/MainPage/CarouselComponent";
import { FLockDescription } from "../components/MainPage/FLockDescription";

export default function IndexPage() {
  const [numberOfTasks, setNumberOfTasks] = useState(0);
  return (
    <Layout>
      <Box
        align="center"
        justify="center"
        alignSelf="center"
        gap="small"
        height="100vh"
      >
        <CarouselComponent />
        <Box direction="row-responsive" gap="xlarge">
          <SecondaryButton
            margin={{ top: "large" }}
            label="Download App"
            size="xlarge"
            pad={{ vertical: "medium", horizontal: "xlarge" }}
            href="https://github.com/FLock-io/client-interface/releases"
            target="_blank"
          />
          <PrimaryButton
            href="/train"
            margin={{ top: "large" }}
            label="Start Training"
            size="xlarge"
            pad={{ vertical: "medium", horizontal: "xlarge" }}
          />
        </Box>
      </Box>
      <div className="max-w-full py-10 flex items-center justify-center overflow-x-scroll mb-4">
        <FLockDescription />
      </div>
      <Image
        src="/try-model.png"
        alt="Image Description"
        margin={{ bottom: "xlarge" }}
      />
      <Box
        align="center"
        justify="center"
        alignSelf="center"
        gap="xlarge"
        height="100vh"
        pad={{ horizontal: "large" }}
        basis="3/4"
      >
        <TasksForHome setNumberOfTasks={setNumberOfTasks} />
      </Box>
    </Layout>
  );
}
