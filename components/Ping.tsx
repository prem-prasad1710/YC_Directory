import React from 'react'

const Ping = () => {
  return (
    <div className='relative'>
      <div className='absolute -left-4 top-1'>
        <span className='flex size-[11px]'>
            <span className='absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75'></span>
                <span className='rwlative inline-flex rounded-full size-[11px] bg-primary'></span>
            </span>
            </div>
      </div>
  )
}

export default Ping
