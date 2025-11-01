<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Product;
use App\Models\Category;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create admin user
        $admin = User::create([
            'name' => 'Admin',
            'email' => 'admin@example.com',
            'password' => Hash::make('password123')
        ]);

        // Create categories
        $categories = [
            ['name' => 'Electronics', 'description' => 'Electronic devices and gadgets'],
            ['name' => 'Clothing', 'description' => 'Fashion and apparel'],
            ['name' => 'Books', 'description' => 'Books and publications']
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Create some products
        $products = [
            [
                'title' => 'Laptop',
                'description' => 'High performance laptop',
                'price' => 999.99,
                'category' => 'Electronics',
                'image' => 'laptop.jpg'
            ],
            [
                'title' => 'T-Shirt',
                'description' => 'Cotton t-shirt',
                'price' => 19.99,
                'category' => 'Clothing',
                'image' => 'tshirt.jpg'
            ],
            [
                'title' => 'Programming Book',
                'description' => 'Learn programming',
                'price' => 49.99,
                'category' => 'Books',
                'image' => 'book.jpg'
            ]
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
