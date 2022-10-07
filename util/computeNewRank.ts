const computeNewRank = ({ prevRank, nextRank }) => {
  let newRank: number
  if (prevRank === -1 && nextRank === -1) {
    // first task in sprint
    newRank = 100
  } else if (prevRank === -1) {
    // append start
    newRank = Math.floor(nextRank / 2)
  } else if (nextRank === -1) {
    // append end
    newRank = prevRank + 100
  } else {
    // insert between tasks
    newRank = Math.floor(prevRank + (nextRank - prevRank) / 2)
  }
  return newRank
}

export default computeNewRank
