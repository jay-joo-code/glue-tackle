import crudEndpoints from "constants/crudEndpoints"
import type { NextApiRequest, NextApiResponse } from "next"
import { getSession } from "next-auth/react"

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getSession({ req })
  const model = crudEndpoints[req?.query?.model as string]?.model

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
      const result = await model.findUnique({
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

      const result = await model.update({
        where: { id: Number(req?.query?.id) },
        data,
      })

      res.json(result)
      break
    }

    case "DELETE": {
      const result = await model.delete({
        where: { id: Number(req?.query?.id) },
      })
      res.json(result)
      break
    }

    default:
      break
  }
  return res.end()
}
