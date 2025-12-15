<?php

namespace App\Repositories\Contracts;

use App\Models\Task;
use Illuminate\Support\Collection;

interface TaskRepositoryInterface
{
    public function allForUser(int $userId): Collection;

    public function allForUserByDueDate(int $userId, string $dueDate): Collection;

    public function findForUser(int $id, int $userId): Task;

    public function create(array $data): Task;

    public function update(int $id, array $data, int $userId): Task;

    public function delete(int $id, int $userId): void;

    public function reorder(array $tasks): void;

    public function searchTask(string $query): Collection;
}
