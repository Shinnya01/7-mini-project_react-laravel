<?php

use App\Models\Item;
use App\Models\Post;
use App\Models\User;
use Inertia\Inertia;
use App\Models\Contact;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\ContactController;

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
            DB::raw('SUM(CASE WHEN type = "contact_manager" THEN 1 ELSE 0 END) as contact_manager')
        )
        ->groupBy('date')
        ->orderBy('date')
        ->get();
        
        $contacts = Contact::count();
        $items = Item::count();
        $posts = Post::count();
        $users = User::count();

        return Inertia::render('dashboard', compact('contacts', 'items', 'posts', 'users', 'chartData'));
    })->name('dashboard');

    Route::resource('to-do-list', ItemController::class);
    Route::resource('blog-post', PostController::class);
    Route::resource('contact-manager', ContactController::class);
});

require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
