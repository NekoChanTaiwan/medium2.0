import React from 'react'
import NextLink from 'next/link'
import NextImage from 'next/future/image'
import logo from '@/assets/logo.png'

function Header() {
  return (
    <header className='mx-auto max-w-7xl'>
      <div className='flex justify-between p-5'>
        <div className='flex items-center space-x-5'>
          <NextLink href='/'>
            <a>
              <NextImage src={logo} alt='Logo' draggable={false} priority className='w-44' />
            </a>
          </NextLink>
          <div className='hidden items-center space-x-5 md:inline-flex'>
            <h3>About</h3>
            <h3>Contact</h3>
            <h3 className='rounded-full bg-green-600 px-4 py-1 text-white'>Follow</h3>
          </div>
        </div>

        <div className='flex items-center space-x-5 text-green-600'>
          <h3>Sign in</h3>
          <h3 className='rounded-full border border-green-600 px-4 py-1'>Get Started</h3>
        </div>
      </div>
    </header>
  )
}

export default Header
