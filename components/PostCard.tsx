import { Paper, Text, Title } from '@mantine/core'
import useIsMobile from 'hooks/isMobile'
import React from 'react'
import ReactMarkdown from 'react-markdown'
import { PostProps } from './Post'

interface IPostCardProps {
  post: PostProps
}

const PostCard = ({ post }: IPostCardProps) => {

  return (
    <Paper style={{ width: '100%' }} mx='0'>
      <Title order={5}>{post?.title}</Title>
      <Text size='sm' color='dimmed'>{post?.author?.name || 'Unknown author'} • {post?.published ? 'Published' : 'Draft'}</Text>
      <Text mt='md'>{post?.content}</Text>
    </Paper>
  )
}

export default PostCard
