import React from 'react'
import Head from 'next/head'
import Banner from '@/components/Banner'
import PostCard from '@/components/PostCard'
import { sanityClient } from '@/lib/sanity'
import type { InferGetStaticPropsType } from 'next'
import type { Post } from '@/types/post'

export const getStaticProps = async () => {
  const query = `*[_type == "post"]{
    _id,
    title,
    slug,
    description,
    mainImage,
    author -> {
      name,
      image
    }
  }`

  const posts = await sanityClient.fetch<[Post]>(query)

  return {
    props: { posts },
    revalidate: 60,
  }
}

function Home({ posts }: InferGetStaticPropsType<typeof getStaticProps>) {
  return (
    <div className='mx-auto max-w-7xl'>
      <Head>
        <title>Medium 2.0</title>
      </Head>
      <Banner />
      <div className='grid grid-cols-1 gap-3 p-2 sm:grid-cols-2 md:gap-6 lg:grid-cols-3'>
        {posts.map((post) => (
          <PostCard key={post._id} post={post} />
        ))}
      </div>
    </div>
  )
}

export default Home
