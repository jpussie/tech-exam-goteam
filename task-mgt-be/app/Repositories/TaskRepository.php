<?php
namespace App\Repositories;
use App\Models\Task;
use Illuminate\Support\Collection;
use App\Repositories\Contracts\TaskRepositoryInterface;
use Illuminate\Support\Facades\DB;

class TaskRepository implements TaskRepositoryInterface
{
    public function allForUser(int $userId): Collection
    {
        return Task::where('user_id', $userId)->get();
    }

    public function allForUserByDueDate(int $userId, string $dueDate): Collection
    {
        return Task::where('user_id', $userId)
            ->whereDate('due_date', $dueDate)
            ->orderby('completed')
            ->orderby('order')
            ->get();
    }

    public function findForUser(int $id, int $userId): Task
    {
        return Task::where('id', $id)
            ->where('user_id', $userId)
            ->firstOrFail();
    }

    public function create(array $data): Task
    {
        return Task::create($data);
    }

    public function update(int $id, array $data, int $userId): Task
    {
        $task = $this->findForUser($id, $userId);
        $task->update($data);

        return $task;
    }

    public function delete(int $id, int $userId): void
    {
        $this->findForUser($id, $userId)->delete();
    }

    public function reorder(array $tasks): void
    {
        DB::transaction(function () use ($tasks) {
            foreach ($tasks as $task) {
                Task::where('id', $task['id'])->update([
                    'order' => $task['order'],
                ]);
            }
        });
    }

    public function searchTask(string $query): Collection
    {
        return Task::where('description', 'LIKE', '%' . $query . '%')
            ->orderBy('due_date')
            ->limit(10)
            ->get();
    }
}
