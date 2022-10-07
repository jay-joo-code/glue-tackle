import useGlueQuery from "hooks/glue/useGlueQuery"

const DBTestPage = () => {
  const { data } = useGlueQuery({
    url: "/glue/task",
  })
  console.log("data", data)
  return <div>DBTestPage</div>
}

export default DBTestPage
