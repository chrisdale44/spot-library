npm run dev
http://localhost:3000

redis-cli ping
brew services stop redis
brew services start redis
redis-cli

Redis config:
/opt/homebrew/etc/redis.conf

/opt/homebrew/var/db/redis/dump.rdb

// to build static files, run both concurrently:
npm run dev
npm run build
// then use a http-server to host static files:
cd ./out
npx http-server

OR run
npm run start
