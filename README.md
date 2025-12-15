# tech-exam-goteam
Tasks Management System for Go Team Technical Exam

# task-mgt-be
composer install

echo "alias sail='[ -f sail ] && sh sail || sh vendor/bin/sail'" >> ~/.bashrc
source ~/.bashrc

sail up -d
sail artisan migrate
sail artisan db:seed



# task-mgt-fe
pnpm install
pnpm run dev
