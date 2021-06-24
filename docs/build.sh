cd /home/deploy/apps/club7-feature-toggle-api

cp .env.example .env

sed "s/@@NODE_ENV/hom/g" -i .env
sed "s/@@NODE_PORT/3001/g" -i .env

sed "s/@@DB_HOST/@@DB_HOST/g" -i .env
sed "s/@@DB_USER/@@DB_USER/g" -i .env
sed "s/@@DB_PASS/@@DB_PASS/g" -i .env
sed "s/@@DB_BASE/@@DB_BASE/g" -i .env

export $(grep -v '^#' .env | xargs)

npm i
npm run build

pm2 stop club7-feature-toggle-api
pm2 start /home/deploy/apps/club7-feature-toggle-api/dist/index.js --name club7-feature-toggle-api -f
pm2 save
