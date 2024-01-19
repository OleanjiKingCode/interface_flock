import { Box, Button, Spinner, Stack, Text } from 'grommet';

import { useEffect, useState } from 'react';
import {getFileExtension} from "@/src/utils/utils";

export const KnowledgePreview = ({
  filePath,
  height = '70%',
}: {
  filePath: string;
  height?: string;
}) => {
  const [pdfData, setPdfData] = useState<string | null>(null);
  const [loadingPreview, setLoadingPreview] = useState<boolean>(false);
  const [previewText, setPreviewText] = useState<string>('');
  const [hasIssue, setHasIssue] = useState<boolean>(false);
  const [hasLink, setHasLink] = useState<boolean>(false);

  const knowledgePreview = async () => {
    try {
      setLoadingPreview(true);
      setHasIssue(false);
      setPdfData(null);
      setPreviewText('');
      setHasLink(false);
      const res = await fetch(`/api/rag/downloadBlob?fileKey=${filePath}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'blob',
        },
      });
      if (res.ok) {
        const data = await res.blob();
        const fileFormat = getFileExtension(filePath)
        const file = new Blob([data], {
          type: fileFormat === 'pdf' ? 'application/pdf' : 'text/plain',
        });
        let fileUrl = null;
        if (fileFormat === 'pdf') {
          fileUrl = URL.createObjectURL(file);
        } else {
          const textUrl = await file.text();
          if (textUrl.startsWith("http") || textUrl.startsWith("https")) {
            fileUrl = textUrl
            setHasLink(true);
          }
          else setPreviewText(textUrl);
        }
        setPdfData(fileUrl);
      } else {
        setHasIssue(true);
      }
      setLoadingPreview(false);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    knowledgePreview();
  }, [filePath]);

  return (
    <>
      <Box overflow="auto" background="#F0F2F3" height={height}>
        {pdfData && (
          <Stack anchor="bottom" fill>
            <iframe src={pdfData} width="100%" height="100%"></iframe>
            {hasLink && (
              <Button
                href={pdfData}
                target="_blank"
                label="Open in new tab"
                margin="small"
                primary
              />
            )}
          </Stack>
        )}
        {previewText && 
          <Box pad="medium" fill overflow="auto">
            <Text weight="bold">{previewText}</Text>
          </Box>
        }
        {hasIssue && 
          <Box fill align='center'>
            <Box background="#B8482B" round="medium" elevation='medium' pad="medium" margin={{top: "large"}}>
              <Text weight="bold">File not found</Text>
            </Box>
          </Box>
        }
        {loadingPreview && (
          <Box fill align="center" margin={{ top: 'large' }}>
            <Spinner size="medium" />
          </Box>
        )}
      </Box>
    </>
  );
};
