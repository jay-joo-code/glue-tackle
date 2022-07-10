import { withSentry } from "@sentry/nextjs"
import endpoints from "constants/glue/crudEndpoints"
import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })
  const model = endpoints[req?.query?.model as string]?.model

  switch (req.method) {
    case "GET":
      const skip =
        req?.query?.page && req?.query?.limit
          ? Number(req?.query?.page) * Number(req?.query?.limit)
          : undefined
      const take = req?.query?.limit ? Number(req?.query?.limit) : undefined

      delete req?.query?.page
      delete req?.query?.limit
      delete req?.query?.model

      const where = {
        ...req?.query,
      }

      const docs = await model.findMany({
        where,
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        skip,
        take,
      })

      res.send(docs)
      break

    case "POST":
      const sessionData = session
        ? {
            user: { connect: { email: session?.user?.email } },
          }
        : {}

      const doc = await model.create({
        data: {
          ...req?.body,
          ...sessionData,
        },
      })

      res.send(doc)
      break

    default:
      res.status(500).send("Invalid http method")
      break
  }
  return res.end()
}

export default withSentry(handle)
