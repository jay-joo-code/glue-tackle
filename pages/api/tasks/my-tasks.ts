import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "lib/glue/prisma"
import { getSession } from "next-auth/react"
import { withSentry } from "@sentry/nextjs"

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  if (!session) {
    res.status(401).send({ message: "Unauthorized" })
    return
  }

  switch (req.method) {
    case "GET":
      // TODO: infinite scroll
      const tasks = await prisma.task.findMany({
        where: {
          user: { email: session.user.email },
        },
        orderBy: {
          updatedAt: "desc",
        },
      })
      res.json(tasks)
      break
    default:
      break
  }
  return res.end()
}

export default withSentry(handle)
