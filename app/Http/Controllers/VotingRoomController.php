<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use App\Models\Activity;
use App\Models\VotingRoom;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class VotingRoomController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $rooms = VotingRoom::all();
        
        return Inertia::render('voting-rooms', compact('rooms'));
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
            // 'status' => 'nullable|in:open,closed',
            'privacy' => 'nullable|in:public,private',
            'start_time' => 'nullable|date|after:now',
            'end_time' => 'nullable|date|after_or_equal:start_time',
        ]);

        $voting = VotingRoom::create([
            'user_id' => Auth::id(), 
            'title' => $request->title,
            'description' => $request->description,
            'status' => $request->status ?? 'open',
            'privacy' => $request->privacy ?? 'public',
            'start_time' => $request->start_time,
            'end_time' => $request->end_time,
        ]);

        Activity::create([
            'user_id' => auth()->id(),
            'type' => 'voting',
            'description' => 'New voting room created',
        ]);

        return redirect()->back();
    }

    /**
     * Display the specified resource.
     */
    public function show(VotingRoom $votingRoom)
    {
        $room = [
            'id' => 1,
            'title' => 'Student Council Election 2025',
            'description' => 'lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.',
            'positions' => [
                [
                    'id' => 1,
                    'title' => 'President',
                    'candidates' => [
                        ['id' => 1, 'name' => 'Alice Johnson', 'party' => 'Unity Party'],
                        ['id' => 2, 'name' => 'Mark Santos', 'party' => 'Progressive Party'],
                        ['id' => 3, 'name' => 'Carlos Dela Cruz', 'party' => 'Independent'],
                    ],
                ],
                [
                    'id' => 2,
                    'title' => 'Vice President',
                    'candidates' => [
                        ['id' => 4, 'name' => 'Laura Kim', 'party' => 'Unity Party'],
                        ['id' => 5, 'name' => 'James Cruz', 'party' => 'Progressive Party'],
                        ['id' => 6, 'name' => 'Nina Valdez', 'party' => 'Independent'],
                    ],
                ],
                [
                    'id' => 3,
                    'title' => 'Secretary',
                    'candidates' => [
                        ['id' => 7, 'name' => 'Francis Lim', 'party' => 'Unity Party'],
                        ['id' => 8, 'name' => 'Grace Dela Torre', 'party' => 'Independent'],
                    ],
                ],
                [
                    'id' => 4,
                    'title' => 'Treasurer',
                    'candidates' => [
                        ['id' => 9, 'name' => 'Miguel Tan', 'party' => 'Unity Party'],
                        ['id' => 10, 'name' => 'Sophia Ramos', 'party' => 'Progressive Party'],
                    ],
                ],
                [
                    'id' => 5,
                    'title' => 'Auditor',
                    'candidates' => [
                        ['id' => 11, 'name' => 'Rafael Gomez', 'party' => 'Unity Party'],
                        ['id' => 12, 'name' => 'Isabel Lopez', 'party' => 'Progressive Party'],
                    ],
                ],
                [
                    'id' => 6,
                    'title' => 'Public Relations Officer',
                    'candidates' => [
                        ['id' => 13, 'name' => 'Daniel Reyes', 'party' => 'Unity Party'],
                        ['id' => 14, 'name' => 'Olivia Santos', 'party' => 'Progressive Party'],
                        ['id' => 15, 'name' => 'Ethan Garcia', 'party' => 'Independent'],
                    ],
                ],
                [
                    'id' => 7,
                    'title' => 'Sergeant-at-Arms',
                    'candidates' => [
                        ['id' => 16, 'name' => 'Patrick Ong', 'party' => 'Unity Party'],
                        ['id' => 17, 'name' => 'Jasmine Rivera', 'party' => 'Progressive Party'],
                    ],
                ],
                [
                    'id' => 8,
                    'title' => 'Business Manager',
                    'candidates' => [
                        ['id' => 18, 'name' => 'Victor Chua', 'party' => 'Unity Party'],
                        ['id' => 19, 'name' => 'Ella Cruz', 'party' => 'Independent'],
                    ],
                ],
                [
                    'id' => 9,
                    'title' => 'Representative - Senior High',
                    'candidates' => [
                        ['id' => 20, 'name' => 'Kevin Bautista', 'party' => 'Unity Party'],
                        ['id' => 21, 'name' => 'Angela Lee', 'party' => 'Progressive Party'],
                    ],
                ],
                [
                    'id' => 10,
                    'title' => 'Representative - College Department',
                    'candidates' => [
                        ['id' => 22, 'name' => 'Thomas Villanueva', 'party' => 'Unity Party'],
                        ['id' => 23, 'name' => 'Samantha Cruz', 'party' => 'Progressive Party'],
                        ['id' => 24, 'name' => 'Liam Mendoza', 'party' => 'Independent'],
                    ],
                ],
            ],
        ];


        return Inertia::render('show-voting-room', compact('room'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(VotingRoom $votingRoom)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, VotingRoom $votingRoom)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(VotingRoom $votingRoom)
    {
        //
    }
}
