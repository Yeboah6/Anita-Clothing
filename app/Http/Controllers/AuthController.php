<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    public function Register() {
        return inertia('Auth/Register');
    }

    public function Login() {
        return inertia('Auth/Login');
    }

    public function ForgotPassword() {
        return inertia('Auth/ForgotPassword');
    }
}
