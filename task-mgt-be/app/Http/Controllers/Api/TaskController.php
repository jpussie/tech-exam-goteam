<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Http\Resources\TaskResource;
use App\Repositories\Contracts\TaskRepositoryInterface;

class TaskController extends Controller
{
    public function __construct(
    protected TaskRepositoryInterface $tasks
    ) {}

    public function index(Request $request)
    {
        $request->validate([
            'due_date' => 'nullable|date',
        ]);

        $userId = $request->user()->id;

        if ($request->filled('due_date')) {
            return TaskResource::collection(
                $this->tasks->allForUserByDueDate(
                    $userId,
                    $request->due_date
                )
            );
        }

        return TaskResource::collection(
            $this->tasks->allForUser($userId)
        );
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'due_date' => 'required|string',
            'description' => 'nullable|string',
        ]);


        $data['user_id'] = $request->user()->id;


        return new TaskResource($this->tasks->create($data));
    }

    public function update(Request $request, int $id)
    {
        $data = $request->validate([
            'due_date' => 'required|string',
            'description' => 'nullable|string',
            'completed' => 'boolean',
        ]);


        return new TaskResource(
            $this->tasks->update($id, $data, $request->user()->id)
        );
    }


    public function destroy(Request $request, int $id)
    {
        $this->tasks->delete($id, $request->user()->id);
        return response()->json([], 204);
    }

    public function search(Request $request)
    {
        $request->validate([
                'q' => ['required', 'string']
            ]);

        $results = $this->tasks->searchTask($request->q);
        return TaskResource::collection($results);
    }

    public function reorder(Request $request)
    {
        $validated = $request->validate([
            'tasks' => ['required', 'array'],
            'tasks.*.id' => ['required', 'integer', 'exists:tasks,id'],
            'tasks.*.order' => ['required', 'integer'],
        ]);

        $this->tasks->reorder($validated['tasks']);

        return response()->noContent();
    }
}
