<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */

       public function handle(Request $request, Closure $next)
   {
       // If the user is logged in BUT their role is not 'admin', block them.
       if ($request->user() && $request->user()->role !== 'admin') {
           return response()->json(['message' => 'Unauthorized. Admins only.'], 403);
       }

       return $next($request); // Otherwise, let them through.
   }
}
