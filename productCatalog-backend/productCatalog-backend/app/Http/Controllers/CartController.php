<?php

namespace App\Http\Controllers;

use App\Models\Cart;
use Illuminate\Http\Request;

class CartController extends Controller
{
    public function index()
    {
        $cart = Cart::with('product')
            ->where('user_id', auth()->id())
            ->get();

        return response()->json([
            'cart' => $cart
        ]);
    }

    public function add(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|integer|min:1'
        ]);

        $cart = Cart::updateOrCreate(
            [
                'user_id' => auth()->id(),
                'product_id' => $request->product_id
            ],
            [
                'quantity' => $request->quantity
            ]
        );

        return response()->json([
            'message' => 'Product added to cart successfully',
            'cart' => $cart->load('product')
        ]);
    }

    public function remove($id)
    {
        $cart = Cart::where('user_id', auth()->id())
            ->where('id', $id)
            ->firstOrFail();

        $cart->delete();

        return response()->json([
            'message' => 'Product removed from cart successfully'
        ]);
    }

    public function clear()
    {
        Cart::where('user_id', auth()->id())->delete();

        return response()->json([
            'message' => 'Cart cleared successfully'
        ]);
    }
}