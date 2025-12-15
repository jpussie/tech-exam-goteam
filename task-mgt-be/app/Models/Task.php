<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Task extends Model
{
    /** @use HasFactory<\Database\Factories\TaskFactory> */
    use HasFactory;

    protected $fillable = [
        'user_id',
        'due_date',
        'description',
        'completed',
    ];

    protected $casts = [
        'completed' => 'boolean',
        'due_date' => 'date',
    ];
}
