# Spot Mapper

## Useful commands

npm run dev
http://localhost:3000

Clear Next cache:
rm -rf .next

redis-cli ping
brew services stop redis
brew services start redis
redis-cli

### Redis config:

/opt/homebrew/etc/redis.conf
/opt/homebrew/var/db/redis/dump.rdb

### to build static files, run both concurrently:

npm run dev
npm run build // localhost needs to be running concurrently for API requests to work
// then use a http-server to host static files:
cd ./out
npx http-server

OR run
npm run start

## Benchmarking:

Simple SSG index page with list of ~2000 spots
./out directory: 3.1MB
Browser data transfered: 2.8MB
main.js 1.1MB
Lighthouse performance: 82
0.5s FCP
1.3s SI
2.8s LCP
2.8 TTI
30ms TBT
