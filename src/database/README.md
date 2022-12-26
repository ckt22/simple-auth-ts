# Heroku setup guide

I am using JawsDB MySQL since it supports JSON data structure.
Scripts:

```
heroku addons:create jawsdb:kitefin
# Check the connection string
heroku config | grep JAWSDB_DATABASE_URL
```