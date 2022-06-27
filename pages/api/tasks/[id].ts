import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"
import prisma from "lib/glue/prisma"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })

  // TODO: conditional authorization (if object has a connected User)
  // if (!session) {
  //   res.status(401).send({ message: "Unauthorized" })
  //   return
  // }

  if (!req?.query?.id) {
    res.status(401).send({ message: "Invalid request: No id specified" })
    return
  }

  switch (req.method) {
    case "GET": {
      const result = await prisma.task.findUnique({
        where: { id: Number(req?.query?.id) },
      })
      res.json(result)
      break
    }

    case "PUT": {
      const userData = session
        ? {
            user: { connect: { email: session?.user?.email } },
          }
        : {}

      const data = { ...req?.body, isValidated: !!session, ...userData }
      delete data.id
      delete data.createdAt
      delete data.updatedAt
      delete data.userId

      const result = await prisma.task.update({
        where: { id: Number(req?.query?.id) },
        data,
      })

      res.json(result)
      break
    }

    case "DELETE": {
      const result = await prisma.task.delete({
        where: { id: Number(req?.query?.id) },
      })
      res.json(result)
      break
    }

    default:
      break
  }
}
