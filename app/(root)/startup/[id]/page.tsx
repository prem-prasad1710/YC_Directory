import { Suspense } from 'react';
import { client } from '@/sanity/lib/client';
import { STARTUP_BY_ID_QUERY, PLAYLIST_BY_SLUG_QUERY } from '@/sanity/lib/queries';
import { notFound } from 'next/navigation';
import React from 'react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';
import markdownit from 'markdown-it';
import { Skeleton } from '@/components/ui/skeleton';
import View from '@/components/View';
import StartupCard, { StartupTypeCard } from '@/components/StartupCard';

const md = markdownit();
export const experimental_ppr = true;

const Page = async ({ params }: { params: { id: string } }) => {
  try {
    const { id } = params;
    const post = await client.fetch(STARTUP_BY_ID_QUERY, { id });

    if (!post) return notFound();

    const editorPosts = await client.fetch(PLAYLIST_BY_SLUG_QUERY, { slug: 'editor-picks' });

    const parsedContent = md.render(post?.pitch || '');

    return (
      <>
        <section className='pink_container !min-h-[230px]'>
          <p className='tag'>{formatDate(post?._createdAt)}</p>
          <h1 className='heading'>{post.title}</h1>
          <p className='sub-heading !max-w-5xl'>{post.description}</p>
        </section>
        <section className='section_container'>
          <img src={post.image} alt="thumbnail" className='w-full h-auto rounded-xl' />
          <div className='space-y-5 mt-10 max-w-4xl mx-auto'>
            <div className='flex-between gap-5'>
              <Link href={`user/${post.author?._id}`} className='flex gap-2 items-center mb-3'>
                <Image src={post.author.image} alt='avatar' width={64} height={64} className='rounded-full drop-shadow-lg' />
                <div>
                  <p className='text-20-medium'>{post.author.name}</p>
                  <p className='text-16-medium  !text-black-300'>@{post.author.username}</p>
                </div>
              </Link>
              <p className='category-tag'>{post.category}</p>
            </div>
            <div dangerouslySetInnerHTML={{ __html: parsedContent }} />
          </div>
        </section>
        {editorPosts && editorPosts.length > 0 && (
          <section className='section_container'>
            <h2 className='heading'>Editor's Picks</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
              {editorPosts.map((post: StartupTypeCard) => (
                <StartupCard key={post._id} post={post} />
              ))}
            </div>
          </section>
        )}
      </>
    );
  } catch (error) {
    console.error('Error fetching data:', error);
    return notFound();
  }
};

export default Page;