<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Inertia\Inertia;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    public function index()
    {
        $items = Item::all();
        return Inertia::render('to-do-list', compact('items'));
    }

    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:pending,ongoing,done',
        ]);

        Item::create($request->only('title', 'description', 'status'));

        return redirect()->back();
    }

    // Notice the parameter name matches the route: {to_do_list}
    public function update(Request $request, Item $to_do_list)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|string|in:pending,ongoing,done',
        ]);

        $to_do_list->update($request->only('title', 'description', 'status'));

        return redirect()->back();
    }

    public function destroy(Item $to_do_list)
    {
        $to_do_list->delete();
        return redirect()->back();
    }
}
