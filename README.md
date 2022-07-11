# Jay Boilerplate

# Setup

### General

- [ ] rename .env.glue to .env
- [ ] add glue remote:

```bash
git remote add glue https://github.com/jay-joo-code/glue-root.git
git fetch --all
git switch -c glue-master glue/master

git push glue HEAD:master # to push a commit to glue/master
```

### Database

1. [Create a new Prisma Data Platform project](https://cloud.prisma.io/projects/create)
2. Follow the steps to create a new project.
3. Copy paste the connection string starting with `postgres://...` to the `DATABASE_URL` in the `.env` file

### Google auth

1. [Go to Google Cloud Console](https://console.cloud.google.com)
2. Create a new project
3. [Configure OAuth Consent Screen](https://console.cloud.google.com/apis/credentials/consent)

- no scopes necessary for basic authentication

4. Create an OAuth Client ID `https://console.cloud.google.com/apis/credentials`

- Authorized JavaScript origins
  - http://localhost:3000
  - https://(app-name).vercel.app
  - https://proddomain.com
- Authorized redirect URIs
  - http://localhost:3000/api/auth/callback/google
  - https://(app-name).vercel.app/api/auth/callback/google
  - https://proddomain.com/api/auth/callback/google


### Deployment (Vercel)

1. [Create a new Sentry project](https://sentry.io/organizations/jay-joo-org/projects/new/)
2. [Create a new Vercel project](https://vercel.com/new) (this deployment should fail)
3. [Configure Vercel integration in Sentry](https://sentry.io/settings/jay-joo-org/integrations/vercel/138276/)
4. Wait 3 - 10 minutes until Sentry env variables are added.
5. Redeploy
6. Add Vercel production endpoint to OAuth providers' redirect URLs.

# Scripts

**Pushing changes to Glue**

```bash
$ git checkout glue-master
$ git cherry-pick <commit-hash>
$ git push
```

# Logic

### Required property validation

- always creates an object when navigating to `/:model/edit`
- impossible to validate required properties on the DB level

### Model status

- defaults to draft on create
- update requests set status to published
- read requests can filter for status
