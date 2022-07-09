# Jay Boilerplate

# Setup

### General

- [ ] rename .env.glue to .env
- [ ] add glue remote:

```bash
$ git add remote glue https://github.com/jay-joo-code/glue-root.git
$ git switch -c glue-master glue/master
$ git push glue HEAD:master # after a commit
```

### Google auth

1. Go to `https://console.cloud.google.com`
2. Create a new project
3. Configure OAuth Consent Screen `https://console.cloud.google.com/apis/credentials/consent`

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
