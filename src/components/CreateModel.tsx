'use client'
import { useAccount } from 'wagmi';
import {
  Box,
  Button,
  Form,
  FormField,
  Heading,
  Layer,
  Spinner,
  Text,
  TextArea,
  TextInput,
  ThemeContext,
} from 'grommet';
import { FormClose, FormPrevious } from 'grommet-icons';
import { PrimaryButton } from './PrimaryButton';
import { SecondaryButton } from './SecondaryButton';
import {useEffect, useState} from 'react';
import {ContentUpload} from './RAG/ContentUpload';
import {Model} from '@prisma/client';
import useEventListener from "@/src/hooks/useEventListener";
import {NOTIFICATION_TYPE_MODEL_VERIFIED} from "@/src/constants/notificationTypes";
import {ModelCreationStepper} from './RAG/ModelCreationStepper';
import ToasterList from './ToasterList';
import useToaster, {IToastContent} from '@/src/hooks/useToaster';
import {MyModels} from './RAG/MyModels';
import { RAG_REWARDS } from '../constants/constants';
import { StepHeader } from './RAG/StepHeader';

type FormData = {
  modelName: string;
  modelIcon?: string;
  description: string;
  tags: string[];
  dataRequired: string;
  ExampleKnowledge?: string;
};

type FormErrors = {
  modelName?: string;
  description?: string;
  dataRequired?: string;
  tags?: string;
  ExampleKnowledge?: string;
};

export interface IOnSubmitProps {
  error?: boolean;
  toast: IToastContent;
}

export interface IStepProps {
  showToaster(props: IOnSubmitProps): void;
}

const ModelDefinitionForm = ({
  value,
  setValue,
  setErrors,
  handleFileChange,
  exampleFiles,
  setExampleFiles,
  errors,
}: {
  value: any;
  setValue: (value: any) => void;
  setErrors(value: any): void;
  selectedFile(value: any): void;
  handleFileChange(value: any): void;
  exampleTexts: string[];
  handleTextChange(value: any): void;
  handleComplete(): void;
  setShowCreateModel: (show: boolean) => void;
  exampleFiles: File[];
  setExampleFiles: (files: File[]) => void;
  isProcessing: boolean;
  errors: any;
}) => {
  const allSuggestions = ['AI', 'Blockchain', 'Project discovery', 'Solidity', 'Move', 'Rust'];

  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [customTag, setCustomTag] = useState<string>('');
  const [suggestions, setSuggestions] = useState<string[]>(allSuggestions);
  const [currentImage, setCurrentImage] = useState<string>('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const file = event.target.files[0];
      setCurrentImage(URL.createObjectURL(file));
    }
  }

  const handleModelNameChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newName = event.target.value;
    setValue({ ...value, modelName: newName });
  
    if (newName.trim() !== '') {
      setErrors({ ...errors, modelName: undefined });
    }
  };

  const handleDescriptionChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDescription = event.target.value;
    setValue({ ...value, description: newDescription });
  
    if (newDescription.trim() !== '') {
      setErrors({ ...errors, description: undefined });
    }
  };

  const handleTagsChange = (newTags: any) => {
    setSelectedTags(newTags);
    setValue({ ...value, tags: newTags });
    
    if (newTags.length > 0) {
      setErrors({ ...errors, tags: undefined });
    } else {
      setErrors({ ...errors, tags: 'Please add at least one tag' });
    }
  };

  const handleDataRequired = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newDataRequired = event.target.value;
    setValue({ ...value, dataRequired: newDataRequired });
  
    if (newDataRequired.trim() !== '') {
      setErrors({ ...errors, dataRequired: undefined });
    }
  };

  const handleExampleFilesChange = (files: File[]) => {
    setExampleFiles(files);
    setValue({ ...value, exampleFiles: files });
  
    if (files.length >= 3) {
      setErrors({ ...errors, exampleKnowledge: undefined });
    } else {
      setErrors({
        ...errors,
        exampleKnowledge: 'Please upload at least three files',
      });
    }
  };
  

  return (
    <>
    <Form
      value={value}
      onChange={setValue}
    >
      <ThemeContext.Extend
        value={{
          formField: {
            border: '',
            content: {
              margin: {
                horizontal: "small",
                vertical: "xsmall"
              }
            },
          },
      }}
      >
      <FormField 
        label="Model Name"
        required 
        error={errors.modelName}>
        <TextArea 
          id="modelName" 
          name="modelName" 
          placeholder="Create your model name here"
          style={{ border: '1px solid #B2BABE', borderRadius: '10px', height: '50px', backgroundColor: 'white'}}
          onChange={handleModelNameChange}  
          value={value.modelName}
        />
      </FormField>
      
      <FormField label="Upload your model icon">
        <Text size="xsmall">A stunning icon will attract more users</Text>
        <div className="flex items-start justify-start w-full">
          <label htmlFor="dropzone-file" className="w-[80px] h-[80px] rounded-[80px] border-2 border-gray-300 border-dashed cursor-pointer hover:border-gray-400">
            {currentImage ?
              <img
                src={currentImage} 
                alt="modelIcon" 
                className="rounded-[80px] object-cover"
              />
              :
              <div className="flex h-full items-center justify-center">
                <svg width="22" height="22" viewBox="0 0 22 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 12.4971H12.5V19.9971C12.5 20.3949 12.342 20.7764 12.0607 21.0577C11.7794 21.339 11.3978 21.4971 11 21.4971C10.6022 21.4971 10.2206 21.339 9.93934 21.0577C9.65804 20.7764 9.5 20.3949 9.5 19.9971V12.4971H2C1.60218 12.4971 1.22064 12.339 0.93934 12.0577C0.658036 11.7764 0.5 11.3949 0.5 10.9971C0.5 10.5992 0.658036 10.2177 0.93934 9.93641C1.22064 9.65511 1.60218 9.49707 2 9.49707H9.5V1.99707C9.5 1.59925 9.65804 1.21771 9.93934 0.93641C10.2206 0.655105 10.6022 0.49707 11 0.49707C11.3978 0.49707 11.7794 0.655105 12.0607 0.93641C12.342 1.21771 12.5 1.59925 12.5 1.99707V9.49707H20C20.3978 9.49707 20.7794 9.65511 21.0607 9.93641C21.342 10.2177 21.5 10.5992 21.5 10.9971C21.5 11.3949 21.342 11.7764 21.0607 12.0577C20.7794 12.339 20.3978 12.4971 20 12.4971Z" fill="#879095"/>
                </svg>
              </div>
            }
            <input
              id="dropzone-file"
              type="file" 
              name="modelIcon" 
              onChange={(event) => {
                  handleFileChange(event);
                  handleImageChange(event);
                }              
              } 
              accept='.jpg, .jpeg, .png, .svg'
              className="hidden"
            />              
          </label>
        </div>
      </FormField>
      <FormField
        htmlFor="description"
        label="Description"
        required
        error={errors.description}
      >
        <Text size="xsmall">
          Please provide a detailed description of the purpose and
          functionalities of this model.
        </Text>
        <TextArea 
          id="description"
          name="description" 
          maxLength={8000}
          style={{ border: '1px solid #B2BABE', borderRadius: '10px', height: '250px', backgroundColor: 'white'}}
          onChange={handleDescriptionChange}
          value={value.description}
        />
      </FormField>
      <FormField
        required
        label="Tags"
        error={errors.tags}
      >
        {selectedTags.length > 0 && (
          <Box
            direction="row-responsive"
            wrap
            align="center"
            justify="start"
            gap="small"
            margin={{bottom: "small"}}
          >
            <Text size="14px" margin={{ top: 'xsmall'}}>{selectedTags.length} of 2</Text>
            {selectedTags.map((tag, index) => (
              <Box
                background="#F2F6FF"
                round="medium"
                pad={{ horizontal: 'small', vertical: 'xsmall' }}
                margin={{ top: 'xsmall'}}
                key={index}
                direction='row'
              >
                <Text size="14px">{tag.trim()}</Text>
                <Button
                  size="small"
                  plain
                  onClick={() => {
                    setSelectedTags(selectedTags.filter((t) => t !== tag));
                    setValue({...value, tags: selectedTags.filter((t) => t !== tag)});
                    handleTagsChange([...selectedTags, customTag]);
                  }}
                  
                  icon={<FormClose size="small" />}
                />
              </Box>
            ))}
          </Box>
        )}
        <Box direction="row" align="center" gap="small">
          <TextInput
            disabled={selectedTags.length >= 2}
            type="search"
            suggestions={suggestions.filter((s) => !selectedTags.includes(s))}
            placeholder="Add tags..."
            onSuggestionSelect={(event) => {
              if (selectedTags.length >= 2) return;
              setSelectedTags([...selectedTags, event.suggestion])
              setValue({ ...value, tags: [...selectedTags, event.suggestion] })
              setCustomTag('')
              handleTagsChange([...selectedTags, event.suggestion]);
            }}
            value={customTag}
            onChange={(event) => {
                setCustomTag(event.target.value);
                const nextValue = event.target.value;
                setValue(nextValue);
                if (!nextValue) setSuggestions(allSuggestions);
                else {
                  const regexp = new RegExp(`^${nextValue}`);
                  setSuggestions(allSuggestions.filter((s) => regexp.test(s)));
                }
            }}
            style={{ border: '1px solid #B2BABE', borderRadius: '10px', height: '50px', backgroundColor: 'white'}}
          />
          <Button
            size="small"
            label="Add"
            disabled={!customTag}
            onClick={() => {
              setSelectedTags([...selectedTags, customTag])
              setValue({ ...value, tags: [...selectedTags, customTag] })
              setCustomTag('')
              console.log('Add tag:', value.tags)
              handleTagsChange([...selectedTags, customTag]);
            }}
          />
        </Box>
      </FormField>
      <FormField label="Data required" 
        required 
        error={errors.dataRequired}
        >
        <Text size="xsmall">
          The description of datasources requirements. For example, you expect
          the data to be Web3 related tweets from Twitter or crypto market news
          from Google search.
        </Text>
        <TextArea
          style={{ border: '1px solid #B2BABE', borderRadius: '10px', height: '250px', backgroundColor: 'white'}}
          id="dataRequired"
          name="dataRequired"
          maxLength={8000}
          onChange={handleDataRequired}
          value={value.dataRequired}
        ></TextArea>
      </FormField>
      <FormField label="Example knowledge" 
        required 
        error={errors.ExampleKnowledge}
        >
        <Box>
          <Text size="xsmall">
            Please give three examples (text, PDF, txt files) for the type of
            knowledge your model requires.
          </Text>
          <ContentUpload files={exampleFiles} setFiles={setExampleFiles} onFilesChange={handleExampleFilesChange} />
        </Box>
      </FormField>
      </ThemeContext.Extend>
    </Form>
    </>
  );
};

const ReceiveRewardsPage = ({
  setShowCreateModel,
}: {
  setStep: (step: number) => void;
  setValue: (value: any) => void;
  setErrors(value: any): void;
  setSelectedFile(value: any): void;
  setExampleFiles: (files: File[]) => void;
  setExampleTexts: (texts: string[]) => void;
  setShowCreateModel: (show: boolean) => void;
}) => {

  const handleBackClick = () => {
    setShowCreateModel(false)
  };

  const [showMyModels, setShowMyModels] = useState(false);

  const commonButtonStyle = {
    width: '300px',
    height: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '0',
    border: '2px solid black',
    borderRadius: '40px',
  };

  const rewardStyle = {
    display: 'inline-block',
    backgroundColor: '#F2F6FF',
    borderRadius: '40px',
    padding: '10px 24px',
    margin: '10px 0',
  };

  return (
    <Box fill align="center" justify="center">
      <Box
        width="medium"
        pad="medium"
        gap="small"
        align="center"
        background="light-1"
        round="small"
        elevation="small"
        style={{ position: 'relative' }}  
      >
        <Box 
          align="end" 
          style={{ position: "absolute", right: 5, top: 5 }} 
          onClick={handleBackClick}
        >
          <FormClose />
        </Box>
        <Spinner color="black" size="medium" />
        <Heading level="3" weight={'bolder'}>
          After your model passes the verification, you will receive
        </Heading>
        <Box style={rewardStyle}>
          <Heading level="3" color={'#6C93EC'} weight={'bolder'}>
            +{RAG_REWARDS.REWARD_FOR_MODEL_CREATION} Points
          </Heading>
        </Box>
        <Box>
          <Text textAlign="center">
            This process will take approximately 10 minutes to 1 hour.
          </Text>
        </Box>
        <Button
          primary
          label="Go to my models"
          style={{
            ...commonButtonStyle,
            backgroundColor: '#6C94EC',
            color: 'white',
          }}
          onClick={() => setShowMyModels(true)}
        />
      </Box>
      {showMyModels && (
          <Layer responsive={true} full>
            <MyModels setShowMyModels={setShowMyModels} />
          </Layer>
        )}
    </Box>
  );
};

enum ShowView{
  CreateView,
  PendingView,
  ConfirmedView,
  SuccessView,
  FailureView,
}

const commonButtonStyle = {
  width: '300px',
  height: '60px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '0',
  border: '2px solid black',
  borderRadius: '40px',
};

const rewardStyle = {
  display: 'inline-block',
  backgroundColor: '#F2F6FF',
  borderRadius: '40px',
  padding: '10px 24px',
  margin: '10px 0',
};

export const CreateModel = ({
  setShowCreateModel,
}: {
  setShowCreateModel: (show: boolean) => void;
}) => {
  const [value, setValue] = useState<FormData>({} as FormData);
  const [errors, setErrors] = useState<FormErrors>({});
  const [isProcessing, setIsProcessing] = useState(false);
  const [step, setStep] = useState(ShowView.CreateView);
  const { address } = useAccount();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [exampleFiles, setExampleFiles] = useState<File[]>([]);
  const [exampleTexts, setExampleTexts] = useState<string[]>(
    new Array(3).fill('')
  );
  const [modelId, setModelId] = useState<string|undefined>();
  const [modelData, setModelData] = useState<Model|undefined>();
  const [showMyModels, setShowMyModels] = useState(false);
  const resetFormState = () => {
    setValue({} as FormData);
    setErrors({});           
    setSelectedFile(null);    
    setExampleFiles([]);      
    setExampleTexts(new Array(3).fill('')); 
  };

  const handleRecreate = () => {
    resetFormState();
    setStep(ShowView.CreateView); 
  };

  const handleEvent = (data: any) => {
    setStep(ShowView.ConfirmedView)
  };
  useEventListener(NOTIFICATION_TYPE_MODEL_VERIFIED, handleEvent,window);

  const getModelData = async (modelId: string) => {
    const res = await fetch(`/api/rag/getModel?modelId=${modelId}`);
    const data = await res.json();
    if (data.error) {
      console.log(data.error);
      return;
    }
    setModelData(data);

    if(data.dataValidationStatus === 'SUCCESS'){
      setStep(ShowView.SuccessView)
    }
    else if(data.dataValidationStatus === 'FAILURE'){
      setStep(ShowView.FailureView)
    }
  };

  useEffect(() => {
    if(step===ShowView.ConfirmedView && modelId){
      getModelData(modelId)
    }
  }, [step,modelId]);

  const checkVerificationResult=async(modelId:string,contributionID:string,fileName:string)=>{
    await fetch(`/api/rag/verifyContributionToMlBackend`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        modelId,
        contributionID,
        fileName,
      }),
    });
  }

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.name === 'modelIcon' && event.target.files) {
      setSelectedFile(event.target.files[0]);
      return;
    }

    if (event.target.name.startsWith('fileInput') && event.target.files) {
      const newFiles = Array.from(event.target.files);
      setExampleFiles((prev) => [...prev, ...newFiles]);
    }
  };

  const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    const index = parseInt(event.target.name.replace('exampleData', '')) - 1;
    const updatedTexts = [...exampleTexts];
    updatedTexts[index] = event.target.value;
    setExampleTexts(updatedTexts);
  };

  const delay = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));

  const { toasts, addToast } = useToaster();
  const showToaster = ({ toast }: IOnSubmitProps) => addToast(toast);

  const handleComplete = async () => {
    setIsProcessing(true);

    const newErrors: FormErrors = {};
    let hasValidationErrors = false;
  
    // Validation checks
    if (!value.modelName) {
      newErrors.modelName = 'Model name is required';
      hasValidationErrors = true;
    }
    if (!value.description) {
      newErrors.description = 'Description is required';
      hasValidationErrors = true;
    }
    if (!value.dataRequired) {
      newErrors.dataRequired = 'Data required is required';
      hasValidationErrors = true;
    }
    if (!value.tags || value.tags.length === 0) {
      newErrors.tags = 'Tags are required';
      hasValidationErrors = true;
    }
    if (exampleFiles.length < 3) {
      newErrors.ExampleKnowledge = 'At least 3 examples are required';
      hasValidationErrors = true;
    }
  
    setErrors(newErrors);
  
    // Display toaster if there are validation errors
    if (hasValidationErrors) {
      showToaster({
        toast: {
          type: 'warning',
          title: 'Warning',
          message: 'Please fill in all the required fields to continue.',
        },
      });
      setIsProcessing(false);
      return;
    }

    if (!address) {
      console.error('User address is not available.');
      return;
    }
    try {
      const filename = selectedFile?.name;

      let modelIconPath;
      let generatedS3=true
      if(filename){
        const reponseFromUpload = await fetch('../api/rag/uploadPublic', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            filename,
          }),
        });
        const dataFromUpload = await reponseFromUpload.json();
        const { url, fields } = dataFromUpload;
        const formDataForS3 = new FormData();
        Object.keys(fields).forEach((key) => {
          formDataForS3.append(key, fields[key]);
        });
        formDataForS3.append('file', selectedFile);
        const responseFromS3 = await fetch(url, {
          method: 'POST',
          body: formDataForS3,
        });
        if (responseFromS3.ok) {
          modelIconPath = `${url}${fields.key}`;
        }else{
          generatedS3=false
        }
      }else{
        const responseFromGenerateImage = await fetch(
          '../api/rag/generateImage?topic=' + value.modelName
        );
        const data = await responseFromGenerateImage.json();
        if(responseFromGenerateImage.ok){
          modelIconPath= data.modelIconPath
        }else{
          generatedS3=false
        }
      }

      if (generatedS3) {
        const responseFromDefineModel = await fetch('/api/rag/defineModel', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            userId: (address as string)?.toLowerCase(),
            modelName: value.modelName,
            modelIcon: value.modelIcon,
            description: value.description,
            tags: value.tags.join(','),
            dataRequired: value.dataRequired,
            modelIconPath: modelIconPath,
          }),
        });


        const dataFromDefineModel = await responseFromDefineModel.json();

        if (!responseFromDefineModel.ok)  {
          console.error('Error adding model:', dataFromDefineModel.message);
        }else {
          console.log('Model added successfully:', dataFromDefineModel);

          // set the modelID for later retrieval on model update
          setModelId(dataFromDefineModel.model.id)

          const contributionResponses=[]
          const newFileNames=[]


          for(let i=0;i<exampleFiles.length;i++) {
            const file = exampleFiles[i]
            const reponseFromUpload = await fetch('../api/rag/upload', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                filename: file.name,
              }),
            });

            const dataFromUpload = await reponseFromUpload.json();

            if (!reponseFromUpload.ok) {
              console.error(
                'Error uploading file to S3:',
                dataFromUpload.message
              );
              continue
            }

            console.log(
              'Post request sent to upload successfully',
              dataFromUpload
            );

            const url = dataFromUpload.url;
            const fields = dataFromUpload.fields;
            newFileNames[i]=fields.key

            const formDataForS3 = new FormData();
            Object.keys(fields).forEach((key) => {
              formDataForS3.append(key, fields[key]);
            });
            formDataForS3.append('file', file);

            console.log(formDataForS3.get('file'));

            const responseFromS3 = await fetch(url, {
              method: 'POST',
              body: formDataForS3,
            });
            console.log('responseFromS3', responseFromS3)
            console.log('fields', fields)
            if (!responseFromS3.ok) {
              console.error(
                'Error uploading real file to S3:',
                dataFromUpload.message
              );
              continue
            }
            console.log('File uploaded to S3 successfully');
            const formDataForContribution = new FormData();
            formDataForContribution.append(
              'userId',
              (address as string)?.toLocaleLowerCase()
            );
            formDataForContribution.append(
              'modelId',
              dataFromDefineModel.model.id
            );
            formDataForContribution.append('filePath', fields.key);

            contributionResponses[i]=await fetch(
              '../api/rag/postContribution',
              {
                method: 'POST',
                body: formDataForContribution,
              }
            )
          }

          for(let i=0;i<exampleFiles.length;i++){
            const file = exampleFiles[i]
            const responseFromContribution=contributionResponses[i]
            const newFileNameInS3=newFileNames[i]
            const dataFromContribution =
              await responseFromContribution.json();
            if (responseFromContribution.ok) {
              await checkVerificationResult(dataFromDefineModel.model.id,dataFromContribution.dataContribution.id, newFileNameInS3)

            console.log(
              'Contribution added successfully:',
              dataFromContribution
            );

            const maxRetries = 10;
            let retryCount = 0;
            let updateSuccess = false;

            while (retryCount < maxRetries && !updateSuccess) {
              try {
                const modelResponse = await fetch(
                  `/api/rag/getModel?modelId=${dataFromContribution.dataContribution.modelId}`
                );
                const modelData = await modelResponse.json();

                if (!modelResponse.ok) {
                  throw new Error(
                    `Error fetching model: ${modelData.message}`
                  );
                }

                let filePath =
                  file.name;

                console.log('modelData', modelData);
                console.log('filePath', filePath);

                const updatedExampleKnowledge = [
                  ...modelData.exampleKnowledge,
                  filePath,
                ];
                const currentVersion = modelData.version;

                const updateModelResponse = await fetch(
                  '/api/rag/updateModel',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      modelId: modelData.id,
                      exampleKnowledge: updatedExampleKnowledge,
                      version: currentVersion,
                    }),
                  }
                );

                const updateModelData = await updateModelResponse.json();

                if (!updateModelResponse.ok) {
                  if (updateModelData.message === 'Version mismatch') {
                    await delay(5000);
                    retryCount++;
                  } else {
                    throw new Error(
                      `Error updating model: ${updateModelData.message}`
                    );
                  }
                } else {
                  console.log(
                    'Model updated successfully with new exampleKnowledge',
                    updateModelData
                  );
                  updateSuccess = true;
                }
              } catch (error) {
                console.error('Error:', error);
                await delay(5000);
                if (retryCount >= maxRetries - 1) {
                  break;
                }
                retryCount++;
              }
            }
            if (updateSuccess) {
              try {
                const addDataContributionResponse = await fetch(
                  '/api/rag/addDataContributionToModel',
                  {
                    method: 'POST',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                      modelId: dataFromDefineModel.model.id,
                      dataContributionId:
                        dataFromContribution.dataContribution,
                    }),
                  }
                );
                const dataFromAddDataContribution =
                  await addDataContributionResponse.json();
                if (addDataContributionResponse.ok) {
                  console.log(
                    'Called addDataContributionToModel API successfully:',
                    dataFromAddDataContribution
                  );
                  setIsProcessing(false);
                  setStep(ShowView.PendingView);
                }
                else {
                  console.error(
                    'Error adding data contribution:',
                    dataFromAddDataContribution.message
                  );
                }
              } catch (error) {
                console.error('Error:', error);
              }
            } else {
              console.error('Failed to update model after retries.');
            }
            } else {
              console.error(
                'Error adding contribution:',
                dataFromContribution.message
              );
            }
          }
        }
      }
    } catch (error) {
      console.error('Error:', error);
      setIsProcessing(false);
    }
  };

  const hasNoValues =
    !value.modelName ||
    !value.description ||
    !value.dataRequired ||
    exampleTexts.filter((text) => text.trim() !== '').length +
      exampleFiles.length <
      3;
  const hasErrors = Object.keys(errors).length > 0;
  const { isConnected } = useAccount();

  let content;
  content = isConnected ? (
    step === ShowView.CreateView ? (
      <>
        <ToasterList toasts={toasts} />
        <Box>
          <Box pad={{bottom: "large"}}>
            <StepHeader
              isFirst={true}
              messages={["1. Model Definition", "2. Receive Rewards"]}
              icons={["model/Contribute.png", "/static/images/blueTick.png", "model/Reward.png", "model/WhiteReward.png"]}
            />
          </Box>
          <ModelDefinitionForm
            value={value}
            errors={errors}
            setErrors={setErrors}
            setValue={setValue}
            selectedFile={setSelectedFile}
            handleFileChange={handleFileChange}
            exampleTexts={exampleTexts}
            handleTextChange={handleTextChange}
            handleComplete={handleComplete}
            setShowCreateModel={setShowCreateModel}
            exampleFiles={exampleFiles}
            setExampleFiles={setExampleFiles}
            isProcessing={isProcessing}
          />
          <Box
            direction="row"
            justify="end"
            gap="medium"
            pad={{ bottom: 'medium' }}
            margin={{ top: 'medium', bottom: 'large' }}
          >
            <Box margin={{ bottom: 'medium' }} pad={{bottom: "large"}}>
              <SecondaryButton
                label="Cancel"
                onClick={() => setShowCreateModel(false)}
              />
            </Box>
            <Box>
              <PrimaryButton
                label="Create"
                busy={isProcessing}
                onClick={handleComplete}
              />
            </Box>
          </Box>
        </Box>
      </>
    ) : step === ShowView.PendingView ? (
      <Box>
        <Box pad={{bottom: "large"}}>
          <StepHeader
              isFirst={false}
              messages={["1. Model Definition", "2. Receive Rewards"]}
              icons={["model/Contribute.png", "/static/images/blueTick.png", "model/Reward.png", "model/WhiteReward.png"]}
          />
        </Box>
        <ReceiveRewardsPage
          setStep={setStep}
          setErrors={setErrors}
          setValue={setValue}
          setSelectedFile={setSelectedFile}
          setExampleFiles={setExampleFiles}
          setExampleTexts={setExampleTexts}
          setShowCreateModel={setShowCreateModel}
        />
      </Box>
    ) : 
    step ===ShowView.SuccessView && modelData ? (
      <Box>
        <Box pad={{bottom: "large"}}>
          <ModelCreationStepper selectedStep={2} />
        </Box>
        <Box fill align="center" justify="center">
        <Box
          width="medium"
          pad="medium"
          gap="small"
          align="center"
          background="light-1"
          round="small"
          elevation="small"
          style={{ position: 'relative' }}  
        >
          <Box 
            align="end" 
            style={{ position: "absolute", right: 5, top: 5 }} 
            onClick={() => setShowCreateModel(false)}
          >
            <FormClose />
          </Box>
          <Heading level="3" weight={'bolder'}>
            Verification succeeded!
          </Heading>
          <Box>
            <Text textAlign="center" color={'#879095'}>
              You have been awarded 
            </Text>
          </Box>
          <Box style={rewardStyle}>
          <Heading level="3" color={'#6C93EC'} weight={'bolder'}>
            +{RAG_REWARDS.REWARD_FOR_MODEL_CREATION} Points
          </Heading>
        </Box>
          <Button
            primary
            label="Go to my models"
            style={{
              ...commonButtonStyle,
              backgroundColor: '#6C94EC',
              color: 'white',
            }}
            onClick={() => setShowMyModels(true)}
          />
          </Box>
          {showMyModels && (
          <Layer responsive={true} full>
            <MyModels setShowMyModels={setShowMyModels} />
          </Layer>
          )}
        </Box>
      </Box>
    ) : step ===ShowView.FailureView && modelData ? (
      <Box>
        <Box pad={{bottom: "large"}}>
          <ModelCreationStepper selectedStep={2} />
        </Box>
        <Box fill align="center" justify="center">
        <Box
          width="medium"
          pad="medium"
          gap="small"
          align="center"
          background="light-1"
          round="small"
          elevation="small"
          style={{ position: 'relative' }}  
        >
          <Box 
            align="end" 
            style={{ position: "absolute", right: 5, top: 5 }} 
            onClick={() => setShowCreateModel(false)}
          >
            <FormClose />
          </Box>
          <Heading level="3" weight={'bolder'}>
            Verification failed!
          </Heading>
          <Box>
            <Text textAlign="center">
              Please review the guidelines to recreate your model. 
            </Text>
          </Box>
          <Button
            primary
            label="Recreate"
            style={{
              ...commonButtonStyle,
              backgroundColor: '#6C94EC',
              color: 'white',
            }}
            onClick={handleRecreate}
          />
          </Box>
        </Box>
      </Box>
    ) :
    null
  ) : (
    <Box width="100%" gap="medium" pad="medium" align="end">
      <Box background="white" round="small" pad="medium">
        <Heading level="3" margin="none">
          Connect wallet to continue
        </Heading>
      </Box>
    </Box>
  );
  
  return (
    <Box overflow="auto" pad="medium" background="#F8FAFB" fill>
      <Box gap="large" fill>
        <Box direction="row" align="center" alignSelf="start" onClick={() => setShowCreateModel(false)}>
          <FormPrevious size='medium' color="lightblue" />
          <Text weight="bold">Back</Text>
        </Box>
        <Box
          pad={{ horizontal: 'xlarge', vertical: 'small' }}
          direction="column"
          align="center"
          justify="start"
        >
          {content}
        </Box>
      </Box>
    </Box>
  );
};
