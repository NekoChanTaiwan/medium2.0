import React from 'react'
import NextImage from 'next/future/image'
import logo from '@/assets/logo-m.png'

function Banner() {
  return (
    <div className='flex items-center justify-between border-y border-black bg-yellow-400 py-10 lg:py-0'>
      <div className='space-y-5 px-10'>
        <h1 className='max-w-xl font-serif text-6xl'>
          <span className='font-bold underline decoration-black decoration-4'>Medium</span>
          &nbsp;is a place to write, read, and contact
        </h1>
        <h2>
          It&apos;s easy and free to post your thinking on any topic and connect with millions of
          readers.
        </h2>
      </div>
      <NextImage
        src={logo}
        alt='Logo'
        draggable={false}
        priority
        className='hidden h-32 w-auto md:inline-flex lg:h-full'
      />
    </div>
  )
}

export default Banner
