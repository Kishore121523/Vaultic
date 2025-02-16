import Card from '@/components/Card';
import Sort from '@/components/Sort';
import { getFiles, getTotalSpaceUsed } from '@/lib/actions/file.actions';
import { convertFileSize, getFileTypesParams, getUsageSummary } from '@/lib/utils';
import { FileType, SearchParamProps } from '@/types'
import { Models } from 'node-appwrite';
import React from 'react'



const page = async ({searchParams, params}: SearchParamProps) => {

  const [totalSpace] = await Promise.all([
    getTotalSpaceUsed(),
  ]);

  // Get usage summary
  const usageSummary = getUsageSummary(totalSpace);

  const type = (await params)?.type as string || '';
  const searchText = ((await searchParams)?.query as string) || '';
  const sort = ((await searchParams)?.sort as string) || '';
  
  const types = getFileTypesParams(type) as FileType[];

  const files = await getFiles({types, searchText, sort});

  return (
    <div className='page-container'>
      <section className="w-full">
        <h1 className="h1 capitalize">{type}</h1>

        <div className="total-size-section">
          <p className="body-1">
            {types.map((type) => {
              const usage = usageSummary.find((summary) => {
              if (type === 'audio' || type === 'video') {
                return summary.type === 'media';
              }
              return summary.type === type;
              });
              if (type === 'video') {
              return null; // Skip rendering for 'video' type since 'media' already covers it
              }
              return (
              <span key={type} className='h5'>
                {usage ? `${convertFileSize(usage.size)}` : '0 MB'}
              </span>
              );
            })}
          </p>

          <div className="sort-container">
            <p className="body-1 hidden sm:block text-light-200">Sort by:</p>

            <Sort />

          </div>
        </div>
      </section>
      
      {files.total > 0 ? (
        <section className='file-list'>
          {files.documents.map((file: Models.Document) => (            
            <Card key={file.$id} file={file}  />
          ))}
        </section>
      ):
      <p className='empty-list'>No files uploaded</p>}
    </div>
  )
}

export default page
