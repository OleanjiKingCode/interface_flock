import {LINK_FILE_SIGNATURE} from "@/src/constants/constants";

export const toReadablePath=(filePath:string)=>{
  let fileNameWithoutUuid=removeUUIDFromFilename(filePath)
  if(fileNameWithoutUuid.startsWith(LINK_FILE_SIGNATURE)){
    fileNameWithoutUuid=removePrefixAndSuffix(fileNameWithoutUuid,LINK_FILE_SIGNATURE,'.txt')
  }
  return fileNameWithoutUuid
}

export const isFilePathLink=(filePath:string)=>{
  return filePath.includes(LINK_FILE_SIGNATURE);
}

function removeUUIDFromFilename(filename: string): string {
  const regex = /[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}_/i;
  return filename.replace(regex, '');
}

function removePrefixAndSuffix(inputString: string, prefix: string, suffix: string): string {
  let result = inputString;

  // Remove prefix
  if (result.startsWith(prefix)) {
    result = result.substring(prefix.length);
  }

  // Remove suffix
  if (result.endsWith(suffix)) {
    result = result.substring(0, result.length - suffix.length);
  }

  return result;
}

export function renameFilename(filename: string): string {
  // Replace all strange characters with underscores
  return filename.replace(/[^a-zA-Z0-9-_.]/g, '_');
}

export function renameFile(originalFile:File, newName:string) {
  return new File([originalFile], newName, {
    type: originalFile.type,
    lastModified: originalFile.lastModified,
  });
}

export function shortenFilename(filename: string): string {
  const maxLength = 30;
  const startMax = 20;
  const endMax = 10;

  if (filename.length <= maxLength) {
    return filename; // No need to shorten
  }

  const startPart = filename.substring(0, startMax);
  const endPart = filename.substring(filename.length - endMax);
  const middlePart = '...';

  return `${startPart}${middlePart}${endPart}`;
}

export function getFileExtension(filename: string): string {
  const lastDotIndex = filename.lastIndexOf('.');
  if (lastDotIndex !== -1) {
    return filename.substring(lastDotIndex + 1);
  } else {
    return ''; // No extension found
  }
}

export async function urlToFile(url:string,fileName:string){
  const resp=await fetch(url);
  const contentType = resp.headers.get('content-type')
  const blob = await resp.blob()
  return new File([blob], fileName, { type:contentType! })
}

export function formatDate(dateString:string){
  function pad(n:number) {return n < 10 ? '0' + n : n}

  const date=new Date(dateString);
  const monthShortNames = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  return `${monthShortNames[date?.getMonth()]} ${date?.getDate()}, ${date?.getFullYear()} ${pad(date?.getHours())}:${pad(date?.getMinutes())}`;
}
export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));
