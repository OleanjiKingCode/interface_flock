import {
  Anchor,
  Box,
  Button,
  FileInput,
  Heading,
  Tab,
  Tabs,
  Text,
  TextArea,
  TextInput,
  ThemeContext,
} from 'grommet';
import {MutableRefObject, useEffect, useRef, useState} from 'react';
import {LINK_FILE_SIGNATURE} from "@/src/constants/constants";
import {renameFile, renameFilename, shortenFilename} from "@/src/utils/utils";

interface ContentUploadProps {
  files: File[];
  setFiles: (files: File[]) => void;
  onFilesChange?: (files: File[]) => void;
}

export const ContentUpload = ({ files, setFiles, onFilesChange }: ContentUploadProps) => {
  const [textValue, setTextValue] = useState('');
  const [linkValue, setLinkValue] = useState('');
  const [isValidUrl, setIsValidUrl] = useState(true);
  const ref=useRef<HTMLInputElement>(null)

  const handleFileChange = (event: any) => {
    const file = event.target.files[0];
    if (file.size > 30000000) {
      alert('File size exceeds 30mb');
      return;
    }

    if (file.type !== 'application/pdf' && file.type !== 'text/plain') {
      alert('File type not supported');
      return;
    }

    const newFile=renameFile(file,renameFilename(file.name))
    setFiles([...files, newFile]);

    const newFiles = [...files, newFile];
    setFiles(newFiles);
    if (onFilesChange) {
      onFilesChange(newFiles);
    }
  };

  useEffect(() => {
    if((!files || !files.length) && ref.current){
      ref.current.value=''
    }
  }, [files,ref.current]);

  const handleTextChange = (event: any) => {
    setTextValue(event.target.value);
  };

  const isValidUrlCheck = (urlString: string) => {
    return /^(?:(?:(?:https?|ftp):)?\/\/)(?:\S+(?::\S*)?@)?(?:(?!(?:10|127)(?:\.\d{1,3}){3})(?!(?:169\.254|192\.168)(?:\.\d{1,3}){2})(?!172\.(?:1[6-9]|2\d|3[0-1])(?:\.\d{1,3}){2})(?:[1-9]\d?|1\d\d|2[01]\d|22[0-3])(?:\.(?:1?\d{1,2}|2[0-4]\d|25[0-5])){2}(?:\.(?:[1-9]\d?|1\d\d|2[0-4]\d|25[0-4]))|(?:(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)(?:\.(?:[a-z\u00a1-\uffff0-9]-*)*[a-z\u00a1-\uffff0-9]+)*(?:\.(?:[a-z\u00a1-\uffff]{2,})))(?::\d{2,5})?(?:[/?#]\S*)?$/i.test(
      urlString
    );
  };

  function replaceStrangeCharsWithUnderscore(input: string): string {
    // Use a regular expression to replace all non-alphanumeric characters with underscores
    return input.replace(/[^a-zA-Z0-9]/g, '_');
  }


  const handleLinkChange = (event: any) => {
    const url = event.target.value;
    if (url.length > 0) {
      setIsValidUrl(isValidUrlCheck(url));
    } else {
      setIsValidUrl(true);
    }
    setLinkValue(url);
  };

  const handleConfirm = () => {
    const blob = new Blob([textValue], { type: 'text/plain' });
    setFiles([
      ...files,
      new File(
        [blob],
        `${replaceStrangeCharsWithUnderscore(textValue.slice(0, 30))}.txt`,
        {
          type: 'text/plain',
        }
      ),
    ]);
    setTextValue('');
  };

  const handleLinkConfirm = () => {
    const blob = new Blob([linkValue], { type: 'text/plain' });
    setFiles([
      ...files,
      new File(
        [blob],
        `${LINK_FILE_SIGNATURE}${linkValue
          .replace('http://', '')
          .replace('https://', '')
          .slice(0, 30)
          .replaceAll(' ', '')
          .trim()}.txt`,
        {
          type: 'text/plain',
        }
      ),
    ]);
    setLinkValue('');
  };

  const handleRemove = (file: File) => {
    setFiles(files.filter((f) => f.name !== file.name));
  };

  return (
    <Box>
      <Box
        round="small"
        border={{ size: 'small', style: 'dashed' }}
        pad="small"
        gap="small"
        background="#FFFFFF"
        width="100%"
      >
        <Heading level="5">Your Knowledge</Heading>
        <Box fill>
          <ThemeContext.Extend
            value={{
              tab: {
                gap: 'medium',
            },
            }}
          >
            <Tabs alignControls="start">
              <Tab title="Upload">
                <Box>
                  <div className="w-full items-center justify-center py-10">
                    <label htmlFor="file-drop" className="font-semibold text-sm text-center">
                      <h2 className="text-lg">Drag & Drop</h2>
                      <p>or <span className="text-[#6C93EC]">browse</span> to choose file</p>
                      <p className="text-sm font-medium text-[#879095]">(PDF or TXT) Max 30mb</p>
                      <input
                        ref={ref}
                        type="file"
                        id="file-drop"
                        accept=".pdf,.txt"
                        onChange={handleFileChange}
                        className='hidden'
                      />
                    </label>
                  </div>
                </Box>
              </Tab>
              <Tab title="Input">
                <Box gap="small" pad={{top: "small"}}>
                  <Box fill>
                    <TextArea
                      fill
                      resize={false}
                      name="exampleData"
                      value={textValue}
                      onChange={handleTextChange}
                      placeholder="Copy & Paste your text here (Website links not supported)"
                    />
                  </Box>
                  <Box alignSelf="end" width="small" fill="vertical">
                    <Button
                      label="Confirm"
                      onClick={handleConfirm}
                      disabled={textValue.trim().length === 0}
                    />
                  </Box>
                </Box>
              </Tab>
              <Tab title="Links">
                <Box gap="small" pad={{top: "small"}}>
                  <Box fill>
                    <TextInput
                      name="link"
                      value={linkValue}
                      onChange={handleLinkChange}
                      placeholder="Copy & Paste your link here"
                    />
                    {!isValidUrl && (
                      <Text color="status-critical">
                        Invalid URL. Please try again.
                      </Text>
                    )}
                  </Box>
                  <Box alignSelf="end" width="small" fill="vertical">
                    <Button
                      label="Confirm"
                      onClick={handleLinkConfirm}
                      disabled={linkValue.trim().length === 0 || !isValidUrl}
                    />
                  </Box>
                </Box>
              </Tab>
            </Tabs>
          </ThemeContext.Extend>
        </Box>
      </Box>
      <Box gap="xsmall" margin={{top: "small"}}>
        {files.map((file: File) => {
          return (
            <div key={file.name} className="flex flex-row justify-between text-sm p-4 rounded-lg shadow border-2">
              <p>{shortenFilename(file.name)}</p>
              <button className='text-[#6C93EC] font-semibold' onClick={() => handleRemove(file)}>
                Remove
              </button>
            </div>
          );
        })}
      </Box>
    </Box>
  );
};
