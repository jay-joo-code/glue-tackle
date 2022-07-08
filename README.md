# Jay Boilerplate

# Setup

- [ ] rename .env.glue to .env
- [ ] add glue remote:
```bash
$ git add remote glue https://github.com/jay-joo-code/glue-root.git
$ git checkout -b glue-master
$ git push -u glue glue-master:master
```
- [ ]

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


