frogfinance wallet-api
====

wallet-api supports self-custody crypto wallets

### db schema
this project uses Prisma and Postgresql for storage
located in `/prisma/schema.prisma`

### testing
integration testing requires docker & a test db instance
use command `make run` to build the api image & database
run `npm test`

#### test configuration
add a `.env.development.local` file with contents:
```yaml
# ENVIRONMENT
ENV=dev

# PORT
PORT=3030

# DATABASE
DATABASE_URL=postgresql://frogadmin:8Dcfe7FpKdKpRtxecXg3sRrukxUNze4q@localhost:15432/frogfinance

# TOKEN
SECRET_KEY=<generate secret key>

ALCHEMY_API_KEY=<add your key>

# LOG
LOG_FORMAT=dev
LOG_DIR=../logs

# CORS
ORIGIN=*
CREDENTIALS=true
```
