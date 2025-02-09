'use client'

import React, {use, useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Button } from './ui/button'
import Image from 'next/image';
import { cn, convertFileToUrl, getFileType } from '@/lib/utils';
import Thumbnail from './Thumbnail';
import { MAX_FILE_SIZE } from '@/constants';
import { useToast } from '@/hooks/use-toast';
import { uploadFile } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';

interface Props {
  ownerId: string;
  accountId: string;
  className?: string;
}

const FileUploader = ({ownerId, accountId, className} : Props) => {
  const path = usePathname();
  const {toast} = useToast();
  const [files, setfiles] = useState<File[]>([])

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    setfiles(acceptedFiles);

    const uploadPromises = acceptedFiles.map(async (file) => {
      // if files is greater than 50MB
      if(file.size > MAX_FILE_SIZE){
        setfiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));

        return toast({
          description: (
            <p className='body-2 text-white'>
              <span className='font-semibold'>{file.name} </span>
              is too large. Max file size is 50MB
            </p>
          ), className: 'error-toast'
        })
      }

      // upload file
      return uploadFile({file, ownerId, accountId, path}).then((uploadedFile) => {
        if(uploadedFile) {
          setfiles((prevFiles) => prevFiles.filter((f) => f.name !== file.name));
        }
      })
    })

    await Promise.all(uploadPromises);
  }, [ownerId, accountId, path])

  const {getRootProps, getInputProps} = useDropzone({onDrop})

  const handleRemoveFile = (e: React.MouseEvent<HTMLImageElement, MouseEvent>, fileName: string) => {
    e.stopPropagation();
    setfiles((prevFiles) => prevFiles.filter((file) => file.name !== fileName));
  } 

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button type='button' className={cn('uploader-button', className)}>
        <Image 
          src='/assets/icons/upload.svg' 
          alt='Upload' 
          width={24} 
          height={24}
        />
        <p>Upload</p>
      </Button>
      {files.length>0 && 
        <ul className='uploader-preview-list'>
          <h4 className='text-light-100 h4'>Uploading</h4>

          {files.map((file, index) => {
            const {type, extension} = getFileType(file.name);

            return (
              <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                <div className="flex items-center gap-3">
                  <Thumbnail type={type} extension={extension} url={convertFileToUrl(file)} />

                  <div className="preview-item-name">
                    {file.name}
                    <Image 
                      src='/assets/icons/file-loader.gif' 
                      alt='loader'
                      width={80} 
                      height={26} />
                  </div>

                  <Image 
                      src='/assets/icons/remove.svg' 
                      alt='remove'
                      width={23} 
                      height={23}
                      onClick={(e) => handleRemoveFile(e, file.name)} />
                </div>
              </li>
            )
          })} 
        </ul>}
    </div>
  )
}

export default FileUploader
