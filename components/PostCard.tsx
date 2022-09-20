import React from 'react'
import Link from 'next/link'
import Image from 'next/future/image'
import { urlFor } from '@/lib/sanity'
import type { Post } from '@/types/post'

function PostCard({ post }: { post: Post }) {
  return (
    <Link href={`/post/${post.slug.current}`}>
      <a className='group rounded-lg border'>
        <div className='relative h-60 w-full overflow-hidden'>
          <Image
            src={urlFor(post.mainImage).url()}
            alt={post.description}
            fill
            quality={50}
            sizes='(max-width: 768px) 100vw,
            (max-width: 1200px) 50vw,
            33vw'
            className='object-cover transition-transform duration-200 group-hover:scale-105'
          />
        </div>
        <div className='flex justify-between bg-white p-5'>
          <div>
            <h3 className='text-lg font-bold'>{post.title}</h3>
            <p className='text-xs'>
              {post.description} by {post.author.name}
            </p>
          </div>
          <Image
            className='h-12 w-12 rounded-full'
            width={48}
            height={48}
            src={urlFor(post.author.image).width(48).height(48).url()}
            alt={post.author.name}
          />
        </div>
      </a>
    </Link>
  )
}

export default PostCard
