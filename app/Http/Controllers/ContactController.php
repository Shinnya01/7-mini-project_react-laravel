<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Contact;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $contacts = Contact::all();
        return Inertia::render('contact-manager', compact('contacts'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string',
            'address' => 'nullable|string|max:500',
        ]);

        $contact = Contact::create([
            'user_id' => Auth::id(), 
            ...$validated,
        ]);

        Activity::create([
            'user_id' => auth()->id(),
            'type' => 'contact_manager',
            'description' => 'new contact created',
        ]);

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Contact $contact)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Contact $contact)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Contact $contact_manager)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email',
            'phone' => 'required|string',
            'address' => 'nullable|string|max:500',
        ]);

        $contact_manager->update($validated);

        return redirect()->back();
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Contact $contact_manager)
    {
        $contact_manager->delete();
        return redirect()->back();
    }
}
