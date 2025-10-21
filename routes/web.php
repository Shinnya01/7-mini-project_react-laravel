<?php

use App\Models\Item;
use App\Models\Note;
use App\Models\Post;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Contact;
use App\Models\VotingRoom;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\NoteController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\VotingRoomController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', function () {

        $chartData = DB::table('activities')
        ->select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('SUM(CASE WHEN type = "to_do" THEN 1 ELSE 0 END) as to_do'),
            DB::raw('SUM(CASE WHEN type = "blog_post" THEN 1 ELSE 0 END) as blog_post'),
            DB::raw('SUM(CASE WHEN type = "contact_manager" THEN 1 ELSE 0 END) as contact_manager'),
            DB::raw('SUM(CASE WHEN type = "note" THEN 1 ELSE 0 END) as note'),
            DB::raw('SUM(CASE WHEN type = "voting" THEN 1 ELSE 0 END) as voting')
        )
        ->groupBy('date')
        ->orderBy('date')
        ->get();
        
        $contacts = Contact::count();
        $items = Item::count();
        $posts = Post::count();
        $users = User::count();
        $voting = VotingRoom::count();
        $notes = Note::count();

        return Inertia::render('dashboard', compact('contacts', 'items', 'posts', 'users', 'notes', 'voting' ,'chartData'));
    })->name('dashboard');

    Route::resource('to-do-list', ItemController::class);
    Route::resource('blog-post', PostController::class);
    Route::resource('contact-manager', ContactController::class);
    Route::resource('note', NoteController::class);
    Route::resource('voting-rooms', VotingRoomController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
