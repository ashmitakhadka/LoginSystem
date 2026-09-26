<?php

use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PasswordResetController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\SessionAuthController;

Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth:sanctum')->group(function(){
    
    Route::get('/user-details', function(Request $request){
        return response()->json([
            'user'=>[
            'email' => $request->user()->email,
            'name'=> $request->user()->name,
            'role'=> $request->user()->role,
            ]
        ]);
    });

    Route::post('/logout', [AuthController::class, 'logout']);

    Route::put('/user-profile', [AuthController::class, 'updateProfile']);
    Route::put('/user-profile',[AuthController::class, 'changePassword']);


    Route::middleware('admin')->group(function () {
        
        Route::get('/admin/stats', function (Request $request) {
            return response()->json([
                'message' => 'Welcome Admin! You have access to secret data.',
            ]);
        });
        
    });

});

//Cookie and Session based
// routes/api.php


Route::prefix('session')->group(function () {
    Route::post('/register', [SessionAuthController::class, 'register']);
    Route::post('/login', [SessionAuthController::class, 'login']);

    Route::post('/forget-password',[PasswordResetController::class, 'forgotPassword']);
    Route::post('/reset-password', [PasswordResetController::class, 'resetPassword']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/user-details', fn (Request $r) => response()->json(['user' => $r->user()]));
        Route::post('/logout', [SessionAuthController::class, 'logout']);
    });
});