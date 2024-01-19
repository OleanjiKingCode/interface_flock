import { Box, Button, Heading, Text } from 'grommet';
import { Copy, FormDown, FormUp } from 'grommet-icons';
import { SecondaryButton } from '../SecondaryButton';
import truncateEthAddress from 'truncate-eth-address';
import { useState } from 'react';

export const ModelDescription = ({
  modelData,
}: {
  modelData: any;
}) => {
  const [isTruncatedDescription, setIsTruncatedDescription] = useState(true);
  const [isTruncatedDataRequired, setIsTruncatedDataRequired] = useState(true);
  return (
    <>
      <Box
        pad="medium"
        background="white"
        round="medium"
        alignSelf="start"
        fill
      >
        <Box direction="row" align="center" gap="medium" justify="between">
          <div className="flex items-center">
            <p className=" text-xl font-extrabold">
              {modelData?.modelName}
            </p>
            <div className="flex flex-wrap ml-2">
              {modelData?.tags
                ?.split(',')
                .slice(0, 2)
                .map((tag: string) => (
                  <div className="px-2 py-1 bg-[#F2F6FF] rounded-2xl mr-2 mb-1">
                    <p className="text-sm text-center">{tag.trim()}</p>
                  </div>
                ))}
            </div>
          </div>
        </Box>
        <Box direction="row" align="center" gap="small" margin={{bottom: "10px", top: "5px"}}>
          <Text size="14px" color="grey">
            Creator address :{' '}
            {modelData?.user?.wallet
              ? truncateEthAddress(modelData?.user?.wallet)
              : ''}
          </Text>
          <Button
            size="small"
            plain
            onClick={() => {
              navigator.clipboard.writeText(modelData?.user?.wallet);
            }}
          >
            {({ hover }) => (
              <Box>
                <Copy color={hover ? 'blue' : 'grey'} size="16px" />
              </Box>
            )}
          </Button>
        </Box>
        <div className="flex flex-col space-y-4 lg:flex-row lg:space-x-10 lg:space-y-0">
          <Box height={{min: "160px"}} fill background="#F2F6FF" round="medium" pad="20px">
            <p className="text-base font-semibold mb-1">
              Model Description
            </p>
            <pre style={{
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
              fontSize: "14px",
              fontFamily: "Gilroy",
              lineHeight: "16px"
            }}>
              {
                modelData?.description?.length < 325 
                ? modelData?.description 
                : isTruncatedDescription 
                  ? modelData?.description?.slice(0, 325) + '...'
                  : modelData?.description
              }
            </pre>
            {modelData?.description?.length >= 325 && (
              <Button
                size="12px"
                margin={{ top: 'small' }}
                onClick={() => setIsTruncatedDescription(!isTruncatedDescription)}
                alignSelf="start"
                reverse
                plain
                label={<Text size="14px" weight="bold">{isTruncatedDescription ? 'Read More' : 'Read Less'}</Text>}
                icon={isTruncatedDescription ? <FormDown /> : <FormUp />}
              />
            )}
          </Box>
          <Box height={{min: "160px"}} fill background="#F2F6FF" round="medium" pad="20px">
            <p className="text-base font-semibold mb-1">
              Knowledge required
            </p>
            <pre style={{
              wordBreak: "break-all",
              whiteSpace: "pre-wrap",
              fontSize: "14px",
              fontFamily: "Gilroy",
              lineHeight: "16px"
            }}>
              {
                modelData?.dataRequired?.length < 325 
                ? modelData?.dataRequired 
                : isTruncatedDataRequired 
                  ? modelData?.dataRequired?.slice(0, 325) + '...'
                  : modelData?.dataRequired
              }
            </pre>
            {modelData?.dataRequired?.length > 325 && (
              <Button
                margin={{ top: 'small' }}
                onClick={() =>
                  setIsTruncatedDataRequired(!isTruncatedDataRequired)
                }
                alignSelf="start"
                reverse
                plain
                label={<Text size="14px" weight="bold">{isTruncatedDataRequired ? 'Read More' : 'Read Less'}</Text>}
                icon={isTruncatedDataRequired ? <FormDown /> : <FormUp />}
              />
            )}
          </Box>              
        </div>
      </Box>
    </>
  );
};
