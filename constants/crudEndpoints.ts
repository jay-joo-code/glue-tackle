import prisma from "lib/glue/prisma"

// NOTE: don't combine crudEndpoints with appConfig
// because importing appConfig will always import prisma client
// and could slow down SSR

const crudEndpoints = {
  sprint: { model: prisma.sprint },
  task: { model: prisma.task },
}

export default crudEndpoints
