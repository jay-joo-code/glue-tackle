import useGlueQuery, { IGlueQueryConfig } from "hooks/glue/useGlueQuery"
import { Session } from "next-auth"

export interface IUseSprintsArgs {
  variant: string
  sessionData: Session
  fetchSince?: Date
}

export const queryConfigSprints = ({
  variant,
  sessionData,
  fetchSince,
}: IUseSprintsArgs): IGlueQueryConfig =>
  variant === "daily"
    ? {
        url: "/glue/sprint",
        args: {
          where: {
            userId: sessionData?.user?.id,
            variant,
            date: {
              gte: fetchSince,
            },
            isArchived: false,
          },
          orderBy: {
            date: "asc",
          },
        },
        autoRefetch: false,
      }
    : {
        url: "/glue/sprint",
        args: {
          where: {
            userId: sessionData?.user?.id,
            variant,
            isArchived: false,
          },
          orderBy: {
            createdAt: "asc",
          },
        },
        autoRefetch: false,
      }

const useSprints = ({ variant, sessionData, fetchSince }: IUseSprintsArgs) => {
  return useGlueQuery(
    queryConfigSprints({
      variant,
      sessionData,
      fetchSince,
    })
  )
}

export default useSprints
