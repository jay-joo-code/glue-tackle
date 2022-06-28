import React from "react"
import useSWRInfinite from "swr/infinite"
import { useState } from "react"
import Skeleton from "react-loading-skeleton"
import InfiniteScrollComponent from "react-infinite-scroll-component"

interface IInfiniteScrollListProps {
  itemComponentFn: (item: any) => React.ReactNode
  endpointPath: string
  limit?: number
  skeletonHeight?: number
  skeletonMarginBottom?: number
}

const InfiniteScrollList = ({
  itemComponentFn,
  endpointPath,
  limit = 10,
  skeletonHeight = 70,
  skeletonMarginBottom = 10,
}: IInfiniteScrollListProps) => {
  const [hasMore, setHasMore] = useState<boolean>(true)

  const getKey = (pageIndex, previousPageData) => {
    if (previousPageData && previousPageData?.length < limit) {
      setHasMore(false)
    }
    if (previousPageData && !previousPageData.length) return null
    return `${endpointPath}?page=${pageIndex}&limit=${limit}`
  }

  const { data, size, setSize } = useSWRInfinite(getKey)

  let dataLength = 0

  if (data) {
    for (let i = 0; i < data.length; i++) {
      dataLength += data[i].length
    }
  }

  return (
    <InfiniteScrollComponent
      dataLength={dataLength}
      next={() => setSize(size + 1)}
      hasMore={hasMore}
      loader={
        <>
          {[...Array(limit)].map((e, i) => (
            <Skeleton
              key={i}
              height={skeletonHeight}
              style={{ marginBottom: `${skeletonMarginBottom}px` }}
            />
          ))}
        </>
      }
    >
      {data?.map((items) => {
        return items?.map(itemComponentFn)
      })}
    </InfiniteScrollComponent>
  )
}

export default InfiniteScrollList
