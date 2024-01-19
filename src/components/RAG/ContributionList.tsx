import {DataContribution} from "@prisma/client";
import styled from "styled-components";
import {Box} from "grommet";
import {shortenFilename, toReadablePath} from "@/src/utils/utils";

interface ContributionListProps {
  contributions: DataContribution[];
}

interface ContributionItemProps {
  contribution: DataContribution;
}

interface ContributionBadge {
  content: string;
}

const capitalizeFirstLetter=(str: string): string=> {
  // Convert the first letter to uppercase and the rest to lowercase
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function trimFileName(fileName: string, maxLength: number): string {
  if (fileName.length <= maxLength) {
    return fileName; // Return the original fileName if it's already within the maxLength
  } else {
    const extensionIndex = fileName.lastIndexOf('.');
    const extension = extensionIndex !== -1 ? fileName.slice(extensionIndex) : '';
    const trimmedName = fileName.slice(0, maxLength - extension.length) + '...';
    return trimmedName + extension;
  }
}

const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return new Intl.DateTimeFormat('en-US', options).format(date);
};

const ContributionBadge = styled.div<{ content: string }>`
  ${({ content }) => {
  let bgClass = 'background-color: #54875D;';
  if (content === 'PENDING') {
    bgClass = 'background-color: #879095;';
  } else if (content === 'FAILURE') {
    bgClass = 'background-color: #B8482B;';
  }
  return `
      ${bgClass}
      color: white;
      font-size: 0.875rem;
      font-weight: 500;
      padding: 0 0.75rem;
      margin-left: 0.5rem;
      border-radius: 9999px;
    `;
}}
`;

const ContributionItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-width: 600px;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.25rem;
`;

const FileName = styled.span`
  font-size: 1rem;
  font-weight: 500;
`;

const ItemDetails = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const Reward = styled.span`
  font-weight: bold;
`;

const DateText = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
`;

const ContributionItem = ({ contribution }: ContributionItemProps) => {
  return (
    <ContributionItemWrapper>
      <Box direction={'row'}>
        <FileName>{shortenFilename(toReadablePath(contribution.filePath))}</FileName>
        <ContributionBadge content={contribution.dataValidationStatus}>
          {capitalizeFirstLetter(contribution.dataValidationStatus)}
        </ContributionBadge>
      </Box>
      <ItemDetails>
        <Reward>+{contribution.rewardAmount}FLC</Reward>
        <DateText>{formatDate(new Date(contribution.updatedAt))}</DateText>
      </ItemDetails>
    </ContributionItemWrapper>
  );
};

export const ContributionList = ({ contributions }: ContributionListProps) => {
  return (
    <div className="h-full w-full max-h-[560px] overflow-y-auto mt-6 space-y-5"
    >
      {contributions.map((contribution) => (
        <ContributionItem key={contribution.id} contribution={contribution} />
      ))}
    </div>
  );
};
