import React from 'react'
import Image from 'next/image'

const Layout = ({children}: {children: React.ReactNode}) => {

  return (
    <div className="flex flex-col justify-center min-h-screen">
      <section className="w-full hidden items-center justify-center lg:flex lg:p-4 lg:pb-0">
        <div className="bg-brand rounded-2xl p-4 shadow-lg w-full flex justify-between items-center">
          <Image 
            src="/assets/icons/logo-full.svg" 
            width={180} 
            height={65} 
            className="h-auto" 
            alt="Logo"
          />

            <h1 className="text-[23px] leading-[42px] font-bold text-center text-white">
            Securely store and manage your files
            </h1>
        </div>
      </section>


      <section className="flex flex-1 flex-col items-center justify-center p-4 py-10 lg:flex-row lg:justify-center lg:p-10 lg:gap-[11rem]">
        <div className="hidden lg:flex">
          <Image 
            src="/assets/images/bg2.png" 
            width={450} 
            height={450} 
            className="transition-all hover:rotate-2 hover:scale-105" 
            alt="files"
          />
        </div>

        <div className="relative w-full max-w-md rounded-2xl bg-white bg-opacity-80 p-8 shadow-lg backdrop-blur-md lg:max-w-lg">
          <div className="mb-10 lg:hidden flex justify-center">
            <Image 
              src="/assets/icons/logo-full-brand.svg" 
              width={224} 
              height={82} 
              className="h-auto w-[200px] lg:w-[250px]" 
              alt="logo"
            />
          </div>

          {children}
        </div>
</section>




    </div>
  )
}

export default Layout