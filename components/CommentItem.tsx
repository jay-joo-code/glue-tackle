import { Box, Text, useMantineTheme } from "@mantine/core"
import moment from "moment"
import { IRedditComment } from "util/reddit"
import CommentHighlight from "./CommentHighlight"

interface ICommentItemProps {
  comment: IRedditComment
}

const CommentItem = ({ comment }: ICommentItemProps) => {
  const date = new Date(0)
  date.setUTCSeconds(Number(comment?.createdAt))
  const theme = useMantineTheme()

  return (
    <Box
      mt="md"
      pb="md"
      px="sm"
      sx={(theme) => ({ borderBottom: `1px solid ${theme.colors.gray[2]}` })}
    >
      <CommentHighlight size="sm" mb="xs">
        {comment?.body}
      </CommentHighlight>
      <Text size="xs" color="dimmed">
        {comment?.ups} upvotes • {moment(date).fromNow()} •{" "}
        <a
          href={`https://www.reddit.com${comment?.permalink}`}
          style={{ color: theme.colors.gray[6] }}
          target="_blank"
          rel="noreferrer"
        >
          Go to comment
        </a>
      </Text>
    </Box>
  )
}

export default CommentItem
