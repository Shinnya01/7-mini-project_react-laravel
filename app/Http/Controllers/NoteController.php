<?php

namespace App\Http\Controllers;

use App\Models\Note;
use Inertia\Inertia;
use App\Models\Activity;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class NoteController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $notes = Note::all();

        return Inertia::render('notes', compact('notes'));
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
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        $note = Note::create([
            'user_id' => Auth::id(), 
            'title' => $request->title,
            'description' => $request->description,
        ]);

        Activity::create([
            'user_id' => auth()->id(),
            'type' => 'note',
            'description' => 'New note created',
        ]);

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(Note $note)
    {

        return Inertia::render('show-note', compact('note'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Note $note)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Note $note)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Note $note)
    {
        //
    }
}
