<?php

namespace App\Http\Controllers\Account;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Address;

class AddressController extends Controller
{
    public function index()
    {
        $user = auth()->user();
        $addresses = Address::where('user_id', $user->id)
            ->orderByDesc('is_default')
            ->orderByDesc('created_at')
            ->get();

        return inertia('Customer/AccountAddresses', [
            'addresses' => $addresses,
            'user' => $user->only(['id', 'name', 'email', 'role']),
        ]);
    }

    public function create()
    {
        $user = auth()->user()->only(['id', 'name', 'email', 'role', 'phone']);
        return inertia('Customer/Address/AddAddress', compact('user'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label'      => 'nullable|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'phone'      => 'required|string|max:255',
            'address'    => 'required|string|max:255',
            'apartment'  => 'nullable|string|max:255',
            'city'       => 'required|string|max:255',
            'state'      => 'required|string|max:255',
            'zip'        => 'required|string|max:255',
            'country'    => 'required|string|max:255',
            'is_default' => 'boolean',
        ]);

        $validated['user_id'] = $request->user()->id;

        if ($validated['is_default'] ?? false) {
            Address::where('user_id', $request->user()->id)->update(['is_default' => false]);
        }

        Address::create($validated);

        return redirect('/account/addresses')->with('success', 'Address saved.');
    }

    public function edit(Address $address)
    {
        abort_unless($address->user_id === auth()->id(), 403);

        return inertia('Customer/Address/EditAddress', [
            'address' => $address,
            'user' => auth()->user()->only(['id', 'name', 'email', 'role']),
        ]);
    }

    public function update(Request $request, Address $address)
    {
        abort_unless($address->user_id === auth()->id(), 403);

        $validated = $request->validate([
            'label'      => 'nullable|string|max:255',
            'first_name' => 'required|string|max:255',
            'last_name'  => 'required|string|max:255',
            'phone'      => 'required|string|max:255',
            'address'    => 'required|string|max:255',
            'apartment'  => 'nullable|string|max:255',
            'city'       => 'required|string|max:255',
            'state'      => 'required|string|max:255',
            'zip'        => 'required|string|max:255',
            'country'    => 'required|string|max:255',
            'is_default' => 'boolean',
        ]);

        if ($validated['is_default'] ?? false) {
            Address::where('user_id', $request->user()->id)
                ->where('id', '!=', $address->id)
                ->update(['is_default' => false]);
        }

        $address->update($validated);

        return redirect('/account/addresses')->with('success', 'Address updated.');
    }
}
