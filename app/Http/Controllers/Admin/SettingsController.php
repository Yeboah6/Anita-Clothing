<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class SettingsController extends Controller
{
    /**
     * Route: GET /admin/settings -> Admin/Setting/Index
     */
    public function index()
    {
        $settings = Setting::allCached();
        $admin = Auth::user();

        [$firstName, $lastName] = $this->splitName($admin->name);

        return Inertia::render('Admin/Setting/Index', [
            'settings' => [
                'store_name'     => $settings->get('store_name', ''),
                'support_email'  => $settings->get('support_email', ''),
                'support_phone'  => $settings->get('support_phone', ''),
                'store_address'  => $settings->get('store_address', ''),
                'currency'       => $settings->get('currency', 'GHS'),
            ],
            'admin' => [
                'first_name' => $firstName,
                'last_name'  => $lastName,
                'email'      => $admin->email,
            ],
        ]);
    }

    private function splitName(?string $name): array
    {
        $name = trim($name ?? '');

        if ($name === '') {
            return ['', ''];
        }

        $parts = explode(' ', $name, 2);

        return [$parts[0], $parts[1] ?? ''];
    }

    public function updateGeneral(Request $request)
    {
        $validated = $request->validate([
            'store_name'    => ['required', 'string', 'max:255'],
            'support_email' => ['required', 'email', 'max:255'],
            'support_phone' => ['nullable', 'string', 'max:50'],
            'store_address' => ['nullable', 'string', 'max:500'],
            'currency'      => ['required', Rule::in(['GHS', 'USD', 'NGN'])],
        ]);

        Setting::setMany($validated);

        return back()->with('success', 'Store settings updated.');
    }

    public function updateAccount(Request $request)
    {
        $admin = Auth::user();

        $validated = $request->validate([
            'first_name' => ['nullable', 'string', 'max:255'],
            'last_name'  => ['nullable', 'string', 'max:255'],
            'email'      => ['required', 'email', 'max:255', Rule::unique('users', 'email')->ignore($admin->getKey(), $admin->getKeyName())],
        ]);

        $admin->update([
            'name'  => trim($validated['first_name'] . ' ' . $validated['last_name']),
            'email' => $validated['email'],
        ]);

        return back()->with('success', 'Profile updated.');
    }

    /**
     * Route: PUT /admin/settings/password
     */
    public function updatePassword(Request $request)
    {
        $admin = Auth::user();

        $validated = $request->validate([
            'current_password' => ['required', 'current_password'],
            'password'          => ['required', 'confirmed', Password::defaults()],
        ]);

        $admin->update([
            'password' => Hash::make($validated['password']),
        ]);

        return back()->with('success', 'Password updated.');
    }
}