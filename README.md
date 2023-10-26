# XSS Target Website

**THE WEBSITE IS INTENDED TO CONTAIN VULNERABILITY FOR CROSS SITE SCRIPTING (XSS)!**

**VISIT SITE AT YOUR OWN RISK!**

---

This a project for learning and demonstrate Cross Site Scripting (XSS) attack.

## Recommended IDE Setup

VSCode + JavaScript and TypeScript Plugin + Deno Plugin.

## Contribute

### Local Database setup

This project is using ``MySQL`` as SQL server.

- <big>WE STRONGLY RECOMMENDED TO CREATE A NEW </big>

Please create a empty database specif for this project. **The database will be complete wipe out by demand in production.** 

- Please create an ``.env`` in root directory with following key value pair.

```
DATABASE_HOST="localhost"
DATABASE_DB="" # database name
DATABASE_USERNAME="" # MySQL username
DATABASE_PASSWORD="" # MySQL password
```
### Development

Run following task to start dev environment.

```
deno task dev
```