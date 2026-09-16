<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use App\Models\User;

class SessionAuthController extends Controller
{
    // Register
    public function register(Request $request)
    {
        $request->validate([
            'username' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:6',
        ]);

        $user = User::create([
            'name' => $request->username,
            'email' => $request->email,
            'password' => bcrypt($request->password),
        ]);

        // Log the user in immediately after registration
        Auth::login($user);

        // Regenerate session
        $request->session()->regenerate();

        return response()->json([
            'user' => $user,
            'message' => 'Registered and logged in',
        ], 201);
    }

    // Login
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required|min:6',
        ]);

        if (!Auth::attempt($request->only('email', 'password'))) {
            throw ValidationException::withMessages([
                'email' => ['Invalid credentials'],
            ]);
        }

        // Prevent session fixation
        $request->session()->regenerate();

        return response()->json([
            'user' => Auth::user(),
            'message' => 'Login successful',
        ]);
    }

    // Logout
    public function logout(Request $request)
    {
        Auth::logout();

        // Invalidate old session
        $request->session()->invalidate();

        // Generate a new CSRF token
        $request->session()->regenerateToken();

        return response()->json([
            'message' => 'Logged out successfully',
        ]);
    }
}