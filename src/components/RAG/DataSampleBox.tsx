import { Anchor, Box, Heading, Layer } from 'grommet';
import { Close, Document } from 'grommet-icons';
import { KnowledgePreview } from './KnowledgePreview';
import { useState } from 'react';

interface DataSampleBoxProps {
  title: string;
  link: string;
}
export const DataSampleBox = ({ title, link }: DataSampleBoxProps) => {
  const [showPreview, setShowPreview] = useState(false);

  return (
    <>
      {showPreview && (
        <Layer responsive>
          <Box
            background="white"
            width="large"
            height="large"
            pad="medium"
            gap="small"
            round="large"
            alignSelf="center"
          >
            <Box alignSelf="end" onClick={() => setShowPreview(false)}>
              <Close />
            </Box>
            <KnowledgePreview filePath={link} height="100%" />
          </Box>
        </Layer>
      )}

      <Box round="small" margin="small" background="#FFFFFF" pad="small">
        <Box direction="row" align="center" justify="center" gap="small">
          <Box>
            <Document />
          </Box>
          <Heading level="4">{title}</Heading>
        </Box>
        <Box alignSelf="end">
          <Anchor label="Preview" onClick={() => setShowPreview(true)} />
        </Box>
      </Box>
    </>
  );
};
