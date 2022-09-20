import { Html, Head, Main, NextScript } from 'next/document'

function Document() {
  return (
    <Html lang='en' className='scroll-smooth antialiased'>
      <Head />
      <body className='overflow-x-hidden'>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}

export default Document
