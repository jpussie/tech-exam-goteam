# tech-exam-goteam
Tasks Management System for Go Team Technical Exam

# task-mgt-be setup local
composer update

echo "alias sail='[ -f sail ] && sh sail || sh vendor/bin/sail'" >> ~/.bashrc (optional)

source ~/.bashrc (optional)

cp .env.example .env

sail up -d

sail artisan migrate

sail artisan db:seed

sail artisan key:generate



# task-mgt-fe setup local
pnpm install

pnpm run dev
