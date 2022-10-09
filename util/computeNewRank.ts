import appConfig from "constants/appConfig"

export const computeNewRank = ({ prevRank, nextRank }) => {
  let newRank: number
  if (prevRank === -1 && nextRank === -1) {
    // first task in sprint
    newRank = appConfig?.rankIncrement
  } else if (prevRank === -1) {
    // append start
    newRank = Math.floor(nextRank / 2)
  } else if (nextRank === -1) {
    // append end
    newRank = prevRank + appConfig?.rankIncrement
  } else {
    // insert between tasks
    newRank = Math.floor(prevRank + (nextRank - prevRank) / 2)
  }
  return newRank
}

export const assignNewRanks = ({
  prevRank,
  nextRank,
  targetTask,
  children,
}) => {
  const rankedTargetTask = targetTask
  const rankedChildren = children

  if (prevRank === -1 && nextRank === -1) {
    // first tasks in sprint
    targetTask.rank = appConfig?.rankIncrement
    children?.forEach((task, idx) => {
      task.rank = appConfig?.rankIncrement * (idx + 1)
    })
  } else if (prevRank === -1) {
    // append start
    const rankGap = Math.floor(nextRank / (children?.length + 2))
    rankedTargetTask.rank = rankGap
    children?.forEach((task, idx) => {
      task.rank = rankGap * (idx + 2)
    })
  } else if (nextRank === -1) {
    // append end
    rankedTargetTask.rank = prevRank + appConfig?.rankIncrement
    children?.forEach((task, idx) => {
      task.rank = prevRank + appConfig?.rankIncrement * (idx + 2)
    })
  } else {
    // insert between tasks
    const rankGap = Math.floor((nextRank - prevRank) / (children?.length + 2))
    rankedTargetTask.rank = prevRank + rankGap
    children?.forEach((task, idx) => {
      task.rank = prevRank + rankGap * (idx + 2)
    })
  }

  return {
    rankedTargetTask,
    rankedChildren,
  }
}
