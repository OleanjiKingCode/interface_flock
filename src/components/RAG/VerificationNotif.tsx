import { Box, Text } from 'grommet';
import { use, useEffect, useState } from 'react';
import styled from 'styled-components';
import {RAG_REWARDS} from "@/src/constants/constants";

interface VerificationNotifProps {
  title: string;
  content: React.ReactNode;
  isSuccess: boolean;
}

interface VerificationResultNotifProps {
  isSuccess: boolean;
  channel: string;
  reward: number;
}

const NotificationBox = styled(Box)<{ isSuccess: boolean }>`
  background-color: ${(props) => (props.isSuccess ? '#54875D' : '#B8482B')};
  width: 300px;
  height: 130px;
  border-radius: 12px;
  border: 2px solid black;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 8px;
`;


export const VerificationNotif = ({
                                    title,
                                    content,
                                    isSuccess,
                                  }: VerificationNotifProps) => {
  return (
    <NotificationBox isSuccess={isSuccess}>
      <Box width={'150px'}>
        {isSuccess?<svg width="48" height="49" viewBox="0 0 48 49" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M24 0.5C10.7464 0.5 0 11.2464 0 24.5C0 37.7536 10.7464 48.5 24 48.5C37.2536 48.5 48 37.7536 48 24.5C48 11.2464 37.2536 0.5 24 0.5ZM35.6268 17.6636C36.2693 16.7651 36.0618 15.5159 35.1634 14.8734C34.2649 14.2309 33.0157 14.4384 32.3732 15.3369L21.5632 30.4535L15.3876 24.5043C14.5921 23.738 13.326 23.7616 12.5596 24.5571C11.7933 25.3526 11.8169 26.6187 12.6124 27.3851L20.4556 34.9406C20.8741 35.3438 21.4474 35.545 22.0262 35.4919C22.6049 35.4387 23.1319 35.1364 23.47 34.6636L35.6268 17.6636Z" fill="#F4F5F6"/>
          </svg>
          :<svg width="49" height="49" viewBox="0 0 49 49" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path fillRule="evenodd" clipRule="evenodd" d="M24.9033 48.9149C38.1582 48.9149 48.9033 38.1698 48.9033 24.9149C48.9033 11.6601 38.1582 0.914917 24.9033 0.914917C11.6485 0.914917 0.90332 11.6601 0.90332 24.9149C0.90332 38.1698 11.6485 48.9149 24.9033 48.9149ZM19.4004 16.0179C18.4631 15.0806 16.9435 15.0806 16.0063 16.0179C15.069 16.9551 15.069 18.4747 16.0063 19.412L21.5092 24.9149L16.0063 30.4179C15.069 31.3551 15.069 32.8747 16.0063 33.812C16.9435 34.7492 18.4631 34.7492 19.4004 33.812L24.9033 28.309L30.4063 33.812C31.3435 34.7492 32.8631 34.7492 33.8004 33.812C34.7376 32.8747 34.7376 31.3551 33.8004 30.4179L28.2974 24.9149L33.8004 19.412C34.7376 18.4747 34.7376 16.9551 33.8004 16.0179C32.8631 15.0806 31.3435 15.0806 30.4063 16.0179L24.9033 21.5208L19.4004 16.0179Z" fill="#FDFDFD"/>
          </svg>}
      </Box>
      <Box pad={"0 16px"}>
        <Text color="white" weight="bold">
          {title}
        </Text>
        <Box>{content}</Box>
      </Box>
    </NotificationBox>
  );
};

export const VerificationResultNotif = ({
                                          isSuccess,
                                          channel,
                                          reward
                                        }: VerificationResultNotifProps) => {

  const content = isSuccess ? (
    <Text style={{lineHeight:'12px'}} size="xsmall" margin={{ bottom: 'none' }} color="white" weight={500}>
      Your <Text size="xsmall" style={{lineHeight:'12px'}} color="yellow">{channel}</Text> has successfully passed the verification. You've been awarded {reward} Points.
    </Text>
  ) : (
    <Text style={{lineHeight:'12px'}} size="xsmall" margin={{ bottom: 'none' }} color="white" weight={500}>
      Your <Text size="xsmall" style={{lineHeight:'12px'}}  color="yellow">{channel}</Text> hasn't passed the verification. Please review the guidelines to reupload your knowledge.
    </Text>
  );

  return (
    <VerificationNotif
      title={isSuccess ? 'Verification Succeeded' : 'Verification Failed'}
      content={content}
      isSuccess={isSuccess}
    />
  );
};