<?php

namespace Database\Seeders;

use Faker\Factory;
use App\Models\Item;
use App\Models\Note;
use App\Models\Post;
use App\Models\User;
use App\Models\Contact;
use App\Models\Activity;
use App\Models\Position;
use App\Models\Candidate;
use App\Models\VotingRoom;
use Illuminate\Database\Seeder;

class RandomDataSeeder extends Seeder
{
    public function run(): void
    {
        $faker = Factory::create();

        $users = User::all();
        if ($users->isEmpty()) {
            $users = User::factory(10)->create();
        }

        foreach ($users as $user) {

            // Items
            for ($i = 0; $i < 10; $i++) {
                $item = Item::create([
                    'title' => $faker->sentence(3),
                    'description' => $faker->paragraph(),
                    'status' => $faker->randomElement(['pending', 'ongoing', 'done']),
                ]);

                $time = $faker->dateTimeBetween('-1 month', 'now');
                Activity::create([
                    'user_id' => $user->id,
                    'type' => 'to_do',
                    'description' => "New item created: {$item->title}",
                    'created_at' => $time,
                    'updated_at' => $time,
                ]);
            }

            // Contacts
            for ($i = 0; $i < 10; $i++) {
                $contact = Contact::create([
                    'user_id' => $user->id,
                    'name' => $faker->name(),
                    'email' => $faker->unique()->safeEmail(),
                    'phone' => $faker->phoneNumber(),
                    'address' => $faker->address(),
                ]);

                $time = $faker->dateTimeBetween('-1 month', 'now');
                Activity::create([
                    'user_id' => $user->id,
                    'type' => 'contact_manager',
                    'description' => "New contact created: {$contact->name}",
                    'created_at' => $time,
                    'updated_at' => $time,
                ]);
            }

            // Notes
            for ($i = 0; $i < 10; $i++) {
                $note = Note::create([
                    'user_id' => $user->id,
                    'title' => $faker->sentence(3),
                    'description' => $faker->paragraph(),
                ]);

                $time = $faker->dateTimeBetween('-1 month', 'now');
                Activity::create([
                    'user_id' => $user->id,
                    'type' => 'note',
                    'description' => "New note created: {$note->title}",
                    'created_at' => $time,
                    'updated_at' => $time,
                ]);
            }

            // Posts
            for ($i = 0; $i < 10; $i++) {
                $post = Post::create([
                    'user_id' => $user->id,
                    'title' => $faker->sentence(3),
                    'description' => $faker->paragraph(),
                ]);

                $time = $faker->dateTimeBetween('-1 month', 'now');
                Activity::create([
                    'user_id' => $user->id,
                    'type' => 'blog_post',
                    'description' => "New post created: {$post->title}",
                    'created_at' => $time,
                    'updated_at' => $time,
                ]);
            }

        }
    }
}
