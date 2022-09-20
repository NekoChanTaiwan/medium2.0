import React from 'react'
import Head from 'next/head'
import Image from 'next/future/image'
import PortableText from 'react-portable-text'
import { useForm, SubmitHandler } from 'react-hook-form'
import { sanityClient, urlFor } from '@/lib/sanity'
import type { GetStaticPaths, GetStaticProps, InferGetStaticPropsType } from 'next'
import type { ParsedUrlQuery } from 'querystring'
import type { Post } from '@/types/post'

interface IFromInput {
  _id: string
  name: string
  email: string
  comment: string
}

interface IParams extends ParsedUrlQuery {
  slug: string
}

interface IProps {
  post: Post
}

export const getStaticPaths: GetStaticPaths = async () => {
  const query = `*[_type == "post"]{
    _id,
    slug,
  }`

  const posts = await sanityClient.fetch<[Post]>(query)

  return {
    paths: posts.map(({ slug }) => ({
      params: {
        slug: slug.current,
      },
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<IProps, IParams> = async (context) => {
  const query = `*[_type == "post" && slug.current == $slug][0]{
    _id,
    _createdAt,
    title,
    author -> {
        name,
        image
    },
    'comments': *[
      _type=="comment" &&
      post._ref==^._id &&
      approved==true
    ],
    description,
    mainImage,
    slug,
    body
  }`

  const post = await sanityClient.fetch<Post | undefined>(query, {
    slug: context.params?.slug,
  })

  if (!post) {
    return {
      notFound: true,
    }
  }

  return {
    props: { post },
    revalidate: 60, // ISR
  }
}

function Post({ post }: InferGetStaticPropsType<typeof getStaticProps>) {
  const [submitted, setSubmitted] = React.useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFromInput>()

  const onSubmit: SubmitHandler<IFromInput> = async (data) => {
    try {
      const res = await fetch('/api/createComment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      console.log(res)
      setSubmitted(true)
    } catch (error) {
      console.error(error)
      setSubmitted(false)
    }
  }

  return (
    <main>
      <Head>
        <title>{post.title}</title>
      </Head>

      <div className='relative h-80'>
        <Image
          src={urlFor(post.mainImage).url()}
          alt={post.title}
          sizes='100vw'
          fill
          priority
          className='object-cover'
        />
      </div>
      <article className='mx-auto max-w-3xl p-5'>
        <h1 className='mt-10 mb-3 text-3xl font-bold'>{post.title}</h1>
        <h2 className='mb-2 text-xl font-light text-gray-500'>{post.description}</h2>

        <div className='flex items-center space-x-2'>
          <Image
            src={urlFor(post.author.image).width(40).height(40).url()}
            width={40}
            height={40}
            alt={post.author.name}
            className='h-10 w-10 rounded-full'
          />
          <p className='text-sm font-extralight'>
            Blog post by {post.author.name} - Published at &nbsp;
            {new Date(post._createdAt).toLocaleString()}
          </p>
        </div>

        <div>
          <PortableText
            dataset={process.env.NEXT_PUBLIC_SANITY_DATASET}
            projectId={process.env.NEXT_PUBLIC_SANITY_PROJECT_ID}
            content={post.body}
            serializers={{
              h1: ({ ...props }) => <h1 {...props} className='my-5 text-2xl text-gray-900' />,
              h2: ({ ...props }) => <h2 {...props} className='my-5 text-xl text-gray-900' />,
              li: ({ ...props }) => <li {...props} className='ml-4 list-disc  text-gray-900' />,
              link: ({ ...props }) => <a {...props} className='text-blue-500 hover:underline' />,
              image: ({ ...props }) => (
                <Image
                  src={urlFor(props).url()}
                  width={Infinity}
                  height={Infinity}
                  alt=''
                  className='object-cover'
                />
              ),
            }}
          />
        </div>
      </article>

      <hr className='max-w-2xg mx-auto border border-yellow-500' />

      {submitted ? (
        <div className='my-10 mx-auto flex max-w-2xl flex-col bg-yellow-500 p-10 text-white shadow-md'>
          <h1 className='text-3xl font-bold'>Thank for submitting your comment!</h1>
          <p>Once it has approved, it&apos;ll appear below!</p>
        </div>
      ) : (
        <form
          className='mx-auto mb-10 flex max-w-2xl flex-col p-5'
          onSubmit={handleSubmit(onSubmit)}
        >
          <h3 className='text-sm text-yellow-500'>Enjoyed this article ?</h3>
          <h4 className='text-3xl font-bold'>Leave a comment below!</h4>
          <hr className='mt-2 py-3' />

          <input {...register('_id')} type='hidden' name='_id' value={post._id} />

          <label className='mb-5 block'>
            <span className='text-gray-700'>Name</span>
            <input
              {...register('name', { required: true })}
              type='text'
              placeholder='Your name'
              autoComplete='disable'
              className='mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring'
            />
          </label>
          <label className='mb-5 block'>
            <span className='text-gray-700'>Email</span>
            <input
              {...register('email', { required: true })}
              type='email'
              placeholder='Your email'
              autoComplete='disable'
              className='mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring'
            />
          </label>
          <label className='mb-5 block'>
            <span className='text-gray-700'>Comment</span>
            <textarea
              {...register('comment', { required: true })}
              className='mt-1 block w-full rounded border py-2 px-3 shadow outline-none ring-yellow-500 focus:ring'
              placeholder='Your comment here...'
              rows={8}
            />
          </label>

          <div className='flex flex-col p-5'>
            {errors.name && (
              <span className='capitalize text-red-500'>- the name field is required</span>
            )}
            {errors.email && (
              <span className='capitalize text-red-500'>- the email field is required</span>
            )}
            {errors.comment && (
              <span className='capitalize text-red-500'>- the comment field is required</span>
            )}
            <input
              type='submit'
              className='focus:shadow-outile cursor-pointer rounded bg-yellow-500 py-2 px-4 font-bold text-white shadow hover:border-yellow-400 focus:outline-none '
            />
          </div>
        </form>
      )}

      <div className='my-10 mx-auto flex max-w-2xl flex-col space-y-2 p-10 shadow shadow-yellow-500'>
        <h3 className='text-4xl font-bold'>Comments</h3>
        <hr className='pb-2' />
        {post.comments.map((comment) => (
          <div key={comment._id}>
            <p>
              <span className='text-yellow-500'>{comment.name}: </span>
              {comment.comment}
            </p>
            <p>- Published at {new Date(comment._createdAt).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default Post
