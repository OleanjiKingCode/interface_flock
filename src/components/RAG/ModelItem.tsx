import { Model} from "@prisma/client";
import styled from "styled-components";
import {Box} from "grommet";


interface ModelItemProps {
  model: Model;
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

const ModelBadge = styled.div<{ content: string }>`
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

const ModelItemWrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  min-width: 600px;
  justify-content: space-between;
  align-items: center;
  margin-top: 0.25rem;
`;

const ModelName = styled.span`
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

export const ModelItem = ({ model }: ModelItemProps) => {
  return (
    <ModelItemWrapper>
      <Box direction={'row'}>
        <ModelName>{trimFileName(model.modelName, 30)}</ModelName>
        <ModelBadge content={model.dataValidationStatus}>
          {capitalizeFirstLetter(model.dataValidationStatus)}
        </ModelBadge>
      </Box>
      <ItemDetails>
        <Reward>+{model.rewardAmount}FLC</Reward>
        <DateText>{formatDate(new Date(model.updatedAt))}</DateText>
      </ItemDetails>
    </ModelItemWrapper>
  );
};

