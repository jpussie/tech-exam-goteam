<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Illuminate\Foundation\Testing\WithFaker;
use Tests\TestCase;
use App\Models\User;
use App\Models\Task;


class TaskApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_user_can_create_task()
    {
        $user = User::factory()->create();


        $response = $this->actingAs($user)
            ->postJson('/api/tasks', [
            'due_date' => '2024-12-31',
            'description' => 'My Task'
        ]);


        $response->assertStatus(201)
            ->assertJsonFragment(['description' => 'My Task']);
    }


    public function test_create_task_fails_without_description()
    {
        $user = User::factory()->create();


        $this->actingAs($user)
            ->postJson('/api/tasks', [])
            ->assertStatus(422);
    }


    public function test_user_can_view_own_tasks()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create([
            'user_id' => $user->id, 
            'due_date' => '2024-12-31', 
            'description' => 'My Task'
        ]);


        $this->actingAs($user)
            ->getJson("/api/tasks/{$task->id}")
            ->assertOk();
    }


    public function test_user_can_delete_task()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create([
            'user_id' => $user->id, 
            'due_date' => '2024-12-31', 
            'description' => 'My Task'
        ]);


        $this->actingAs($user)
            ->deleteJson("/api/tasks/{$task->id}")
            ->assertNoContent();
    }

    public function test_user_can_update_task()
    {
        $user = User::factory()->create();
        $task = Task::factory()->create([
            'user_id' => $user->id, 
            'due_date' => '2024-12-31', 
            'description' => 'My Task'
        ]);
        
        $this->actingAs($user)
            ->putJson("/api/tasks/{$task->id}", [
                'due_date' => '2025-01-15',
                'description' => 'Updated Task',
                'completed' => true,
            ])
            ->assertOk()
            ->assertJsonFragment(['description' => 'Updated Task']);
    }

    /**
     * A basic feature test example.
     */
    // public function test_example(): void
    // {
    //     $response = $this->get('/');

    //     $response->assertStatus(200);
    // }
}
