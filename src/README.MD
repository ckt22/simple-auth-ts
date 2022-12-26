# Heroku setup
Reference: https://www.bezkoder.com/deploy-node-js-app-heroku-cleardb-mysql/
Scripts
```
heroku login

# in the root with git repo initiated
heroku create aha-code-test
git push heroku main
heroku run bash
heroku logs --tail
```