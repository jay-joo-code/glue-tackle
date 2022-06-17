import {
  CSSObject,
  HighlightProps,
  MantineColor,
  MantineTheme,
  Mark,
  SharedTextProps,
  Text,
  useMantineTheme,
} from "@mantine/core"
import React from "react"
import { highlighter, IHighlightConfig } from "util/highlighter"
import { courseKeywords } from "util/redditKeywords"

interface ICommentHighlightProps extends SharedTextProps {
  /** Full string part of which will be highlighted */
  children: string
}

const CommentHighlight = ({ children, ...rest }: ICommentHighlightProps) => {
  const highlightChunks = highlighter(children, Object.keys(courseKeywords))
  const theme = useMantineTheme()

  // console.log("highlightChunks", highlightChunks)

  return (
    <Text {...rest}>
      {highlightChunks.map(({ chunk, highlighted }, i) => {
        let keyword = chunk.trim().toLowerCase()

        const color =
          courseKeywords[keyword] === 0
            ? theme.colors.blue[9]
            : courseKeywords[keyword] > 0
            ? theme.colors.green[9]
            : theme.colors.red[9]

        return highlighted && courseKeywords[keyword] !== 0 ? (
          <mark key={i} style={{ backgroundColor: "inherit", color }}>
            {chunk}
          </mark>
        ) : (
          <span key={i}>{chunk}</span>
        )
      })}
    </Text>
  )
}

export default CommentHighlight
