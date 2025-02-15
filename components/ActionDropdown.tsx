"use client";

import { Models } from 'node-appwrite'
import React, { useState } from 'react'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"


import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from 'next/image';
import { actionsDropdownItems } from '@/constants';
import { ActionType } from '@/types';
import Link from 'next/link';
import { constructDownloadUrl } from '@/lib/utils';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { getFileUsers, renameFile, updateFileUsers } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';
import { FileDetails, ShareInput } from './ActionsModelContent';



const ActionDropdown = ({file}:{file:Models.Document}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [action, setAction] = useState<ActionType | null>(null);
  const [isLoading, setisLoading] = useState(false);
  const [name, setname] = useState(file.name);
  const [emails, setEmails] = useState<string[]>([])

  const path = usePathname();

  const closeAllModals = () => {
    setIsModalOpen(false);
    setIsDropDownOpen(false);
    setAction(null);
    setname(file.name);
  }

  const handleRemoveUser = async (email: string) => {
    const currentEmails = await getFileUsers({ fileId: file.$id, path });
    const updateEmails = currentEmails.filter((e: string) => e !== email);
    
    const success = await updateFileUsers({fileId:file.$id, emails:updateEmails, path, method:"remove"});
    
    if(success) setEmails(updateEmails);
    closeAllModals();
  }

  const handleAction = async() => {
    if(!action) return;

    setisLoading(true);
    let success = false;

    const actions = {
      rename: () => renameFile({fileId: file.$id, name, extension:file.extension, path}),
      share: () => updateFileUsers({fileId: file.$id, emails, path, method:"share"}),
      delete: () => console.log('delete'),
    }

    success = await actions[action.value as keyof typeof actions]();
    if(success) closeAllModals();
    setisLoading(false);

  }


  const renderDialogContent = () => {
    if(!action) return null;

    return (
      <DialogContent className='shad-dialog button'>
        <DialogHeader className='flex flex-col gap-3'>
          <DialogTitle className='text-center text-light-100'>{action.label}</DialogTitle>
          {action.value === 'rename' && (
            <Input 
              type='text'
              value={name}
              onChange={(e) => setname(e.target.value)}
            />
          )}

          {action.value === 'details' && <FileDetails file={file}/> }

          {action.value === 'share' && (
            <ShareInput file={file} onInputChange={setEmails} onRemove={handleRemoveUser} />
          )}
        </DialogHeader>

        {['rename', 'delete', 'share'].includes(action.value) && (
          <DialogFooter className='flex flex-col gap-3 md:flex-row'>
            <Button onClick={closeAllModals} className='modal-cancel-button'>
              Cancel
            </Button>
            <Button onClick={handleAction} className='modal-submit-button'>
              <p className='capitalize'>{action.value}</p>
              {isLoading && (
                <Image 
                  src="assets/icons/loader.svg" 
                  alt="loader"
                  width={24}
                  height={24}
                  className='animate-spin'
                />
              )}
            </Button>
          </DialogFooter>
        )}
      </DialogContent>
    )
  }
  return (
    <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
          <DropdownMenu open={isDropDownOpen} onOpenChange={setIsDropDownOpen}>
              <DropdownMenuTrigger className='shad-no-focus'>
                <Image 
                  src="/assets/icons/dots.svg"
                  alt="dots"
                  width={25}
                  height={25}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel className='max-w-[200px] truncate'>{file.name}</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {actionsDropdownItems.map((actionItem) => (
                  <DropdownMenuItem 
                    key={actionItem.value} 
                    className='shad-dropdown-item' 
                    onClick={() => {
                        setAction(actionItem);
                        if(['rename', 'share', 'delete', 'details'].includes(actionItem.value)){
                          setIsModalOpen(true);
                        }}}
                  >
                    
                    {actionItem.value === 'download' ? 
                      (<Link href={constructDownloadUrl(file.bucketFileId)} download={file.name} className='flex items-center gap-2'>
                        <Image
                        src={actionItem.icon}
                        alt={actionItem.label}
                        width={30}
                        height={30}
                        />
                        {actionItem.label}
                      </Link> )
                    : 
                  (<div className="flex items-center gap-2">
                      <Image
                        src={actionItem.icon}
                        alt={actionItem.label}
                        width={30}
                        height={30}
                        />
                        {actionItem.label}
                    </div>
                    )}
                  </DropdownMenuItem>
          ))}
              </DropdownMenuContent>
          </DropdownMenu>

          {renderDialogContent()}
    </Dialog> 
  )
}

export default ActionDropdown
