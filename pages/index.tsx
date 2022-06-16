import React from "react"
import type { GetServerSideProps } from "next"
import Layout from "../components/Layout"
import Post, { PostProps } from "../components/Post"
import prisma from "../lib/prisma"
import { Paper } from "@mantine/core"
import Flex from "components/Flex"
import PostCard from "components/PostCard"
import api from "lib/api"

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

interface IRedditComment {
  body: String
  permalink: String
  ups: Number
  createdAt: Date
}

const Index: React.FC<Props> = (props) => {
  const allComments: IRedditComment[] = []

  const fetchData = async () => {
    const { data } = await api.get(
      "https://www.reddit.com/r/Cornell/search/.json?q=cs%203410&limit=5&restrict_sr=1&sr_nsfw=&t=all"
    )

    const recurseReplies = (replies, url) => {
      if (!replies) return

      replies?.data?.children?.map((reply) => {
        // console.log(
        //   "reply",
        //   url,
        //   reply?.data?.body,
        //   reply?.data?.ups,
        //   reply?.data?.permalink,
        //   reply?.data?.replies,
        //   {
        //     body: reply?.data?.body,
        //     permalink: reply?.data?.permalink,
        //     ups: reply?.data?.ups,
        //     createdAt: new Date(reply?.data?.created_utc),
        //   }
        // )
        allComments.push({
          body: reply?.data?.body,
          permalink: reply?.data?.permalink,
          ups: reply?.data?.ups,
          createdAt: new Date(reply?.data?.created_utc),
        })
        recurseReplies(reply?.data?.replies, url)
      })
    }

    const promises = data?.data?.children?.map(async (post) => {
      const { data: postData } = await api.get(`${post?.data?.url}.json`)
      if (postData && postData?.length >= 2) {
        const comments = postData[1]?.data?.children
        comments.map((comment) => {
          // console.log(
          //   "postData",
          //   post?.data?.url,
          //   comment?.data?.body,
          //   comment?.data?.ups,
          //   comment?.data?.permalink,
          //   comment?.data?.replies
          // )
          allComments.push({
            body: comment?.data?.body,
            permalink: comment?.data?.permalink,
            ups: comment?.data?.ups,
            createdAt: new Date(comment?.data?.created_utc),
          })
          recurseReplies(comment?.data?.replies, post?.data?.url)
        })
      }
    })

    await Promise.all(promises)
    console.log("allComments", allComments)
  }

  fetchData()

  return (
    <Flex direction="column" style={{ maxWidth: "500px" }} px="md" spacing="xl">
      {props?.feed?.map((post) => (
        <PostCard key={post?.id} post={post} />
      ))}
    </Flex>
  )
}

export default Index
