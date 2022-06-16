import React from "react"
import type { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from "../lib/prisma"
import { Paper } from "@mantine/core"
import Flex from "components/Flex"
import PostCard from "components/PostCard"

export const getServerSideProps: GetServerSideProps = async () => {
  const feed = await prisma.post.findMany({
    where: {
      published: true,
    },
    include: {
      author: {
        select: {
          name: true,
        },
      },
    },
  })
  return {
    props: { feed },
  }
}

type Props = {
  feed: PostProps[]
}

const Index: React.FC<Props> = (props) => {
  return (
    <Flex direction="column" style={{ maxWidth: "500px" }} px="md" spacing="xl">
      {props?.feed?.map((post) => (
        <PostCard key={post?.id} post={post} />
      ))}
    </Flex>
  )
}

export default Index
