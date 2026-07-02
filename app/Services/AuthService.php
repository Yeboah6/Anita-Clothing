<?php

namespace App\Services;

use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthService
{
    public function register(array $data): User
    {
        return User::create([
            'name' => $data['first_name']. ' '.$data['last_name'],
            'email' => strtolower($data['email']),
            'password' => Hash::make($data['password']),
            'role' => 'customer',
        ]);
    }
}