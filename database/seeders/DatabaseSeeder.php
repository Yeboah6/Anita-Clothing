<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;
use App\Traits\IdGenerator;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {

        User::create([
            // 'user_id' => Str::uuid(),
            // 'user_id' => IdGenerator::userId(),
            'name' => 'Anita',
            'email' => 'anita@clothing.com',
            'role' => 'admin',
            'phone' => '0576760647',
            'password' => Hash::make('Anita123'),
            'status' => "active"
        ]);
    }
}
