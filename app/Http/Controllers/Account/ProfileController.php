<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;

class ProfileController extends Controller
{
    public function index()
    {
        $user = Auth::user();
    
        $orders = $user->orders()->with('payment')->latest()->get();
    
        $nameParts = explode(' ', $user->name, 2);
    
        $totalSpent = $orders
            ->pluck('payment')
            ->filter(fn ($payment) => $payment && $payment->status === 'success')
            ->sum('amount');
    
        return inertia('Customer/AccountProfile', [
            'currentCustomer' => [
                'name'   => $user->name,
                'email'  => $user->email,
                'phone'  => $user->phone,
                'joined' => $user->created_at->format('F Y'),
                'avatar' => $this->getInitials($user->name),
            ],
            'profileForm' => [
                'firstName' => $nameParts[0] ?? '',
                'lastName'  => $nameParts[1] ?? '',
                'email'     => $user->email,
                'phone'     => $user->phone,
            ],
            'stats' => [
                'totalOrders' => $orders->count(),
                'totalSpent'  => (float) $totalSpent,
            ],
        ]);
    }

    public function updateProfile(Request $request)
    {
        $user = Auth::user();

        $validated = $request->validate([
            'firstName' => ['required', 'string', 'max:255'],
            'lastName'  => ['nullable', 'string', 'max:255'],
            'email'     => [
                'required', 'email', 'max:255',
                Rule::unique('users', 'email')->ignore($user->id),
            ],
            'phone'     => ['nullable', 'string', 'max:20'],
        ]);

        $user->update([
            'name'  => trim($validated['firstName'] . ' ' . ($validated['lastName'] ?? '')),
            'email' => $validated['email'],
            'phone' => $validated['phone'] ?? null,
        ]);

        return back()->with('success', 'Profile updated successfully.');
    }

    public function updatePassword(Request $request)
    {
        $user = Auth::user();
    
        $validated = $request->validate([
            'current' => ['required', 'string'],
            'new'     => ['required', 'string', Password::defaults()],
            'confirm' => ['required', 'string'],
        ], [], [
            'new' => 'new password',
        ]);
    
        if (!Hash::check($validated['current'], $user->password)) {
            return back()->withErrors(['current' => 'The current password is incorrect.']);
        }
    
        if ($validated['new'] !== $validated['confirm']) {
            return back()->withErrors(['confirm' => 'Passwords do not match.']);
        }
    
        $user->update([
            'password' => Hash::make($validated['new']),
        ]);
    
        return back()->with('success', 'Password updated successfully.');
    }

    private function getInitials(string $name): string
    {
        $parts = explode(' ', trim($name));
        $initials = strtoupper(substr($parts[0] ?? '', 0, 1) . substr($parts[1] ?? '', 0, 1));
        return $initials ?: '?';
    }
}
