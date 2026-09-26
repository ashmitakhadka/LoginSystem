<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function register(Request $request)
{
    $request->validate([
        'username' => 'required|string',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|min:6|same:c_password',
    ]);

    $user = User::create([
        'name' => $request->username,
        'email' => $request->email,
        'password' => bcrypt($request->password),
    ]);

    return response()->json([
        'user' => $user,
        'status' => 201,
        'message' => 'User Registered successfully',
    ], 201);
}

    public function login(Request $request){
        $request->validate([
            'email'=>'required|email',
            'password'=>'required|min:6',
        ]);

       if (!Auth::attempt($request->only('email', 'password'))) {
    return response()->json([
        'message' => 'Invalid credentials'
    ], 401);
}
        $user = User::where('email', $request->email)->first();
        $token = $user->createToken('api-token')->plainTextToken;

        // Inside your login() method, change the return statement to:
       return response()->json([
      'message' => 'Login successful',
      'token' => $token,
      'user' => [
       'name' => $user->name,
        'role' => $user->role // <--- ADD THIS LINE
    ]
]);
    }

    public function logout(Request $request){
    
    $request->user()->currentAccessToken()->delete();
    
    return response()->json([
        'message' => "Logged out successfully",
    ]);
}

public function updateProfile(Request $request)
{
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
    ]);

    $user = $request->user();

    $user->update([
        'name' => $request->name,
        'email' => $request->email,
    ]);

    return response()->json([
        'message' => 'Profile updated successfully',
        'user' => [
            'name' => $user->name,
            'email' => $user->email,
            'role' => $user->role,
        ],
    ]);
}

public function changePassword(Request $request){
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|email',
    ]);
     $user = $request->user();
      $user->update([
        'password' => $request->name, 
    ]);
    return response()->json([
        'message'=> "Password updated successfully",
        'user'=> $user->password,
    ]);
}
}
