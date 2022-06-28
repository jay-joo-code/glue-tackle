# Jay Boilerplate

# CRUD files generation

## Frontend

| Function | Path |
| ---------------- | ---------------- |
| Some content     | Other content    |****

public task list /task

public task list /task
task details /task/:id
create task /task/edit
edit task /task/edit/:id

## Backend

GET /api/task/
POST /api/task/

(authorization required)
GET /api/task/:id
PUT /api/task/:id
DELETE /api/task/:id

## Logic

### Required property validation

- always creates an object when navigating to `/:model/edit`
- impossible to validate required properties on the DB level

### Model status

- defaults to draft on create
- update requests set status to published
- read requests can filter for status


# Scripts

**Pushing changes to Glue**

```bash
$ git checkout glue-master
$ git cherry-pick <commit-hash>
$ git push
```

