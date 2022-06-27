import type { NextApiRequest, NextApiResponse } from "next"
import prisma from "lib/glue/prisma"
import { getSession } from "next-auth/react"
import { withSentry } from "@sentry/nextjs"

async function handle(req: NextApiRequest, res: NextApiResponse) {
  const session = await getSession({ req })

  switch (req.method) {
    case "GET":
      // TODO: infinite scroll
      const tasks = await prisma.task.findMany({
        where: {
          isValidated: true,
        },
        include: {
          user: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
      res.json(tasks)
      break

    case "POST":
      const data = session
        ? {
            user: { connect: { email: session?.user?.email } },
          }
        : {}

      const task = await prisma.task.create({
        data,
      })

      res.json(task)
      break

    default:
      res.status(500).send("Invalid http method")
      break
  }
}

export default withSentry(handle)
