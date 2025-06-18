<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use Laravel\Socialite\Facades\Socialite;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class SocialiteController extends Controller
{
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->redirect();
    }

    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->user();


            $user = User::firstOrCreate(
                [
                    'email' => $googleUser->getEmail(),
                    'google_id' => $googleUser->getId(),

            ],
                [
                    'name' => $googleUser->getName(),
                    'avatar' => $googleUser->getAvatar(),
                    'password' => bcrypt($googleUser->getEmail()),
                ]
            );


            // Log the user in
            Auth::login($user, true);

            return Inertia::location(route('dashboard'));
        } catch (\Exception $e) {
            return redirect()->route('login')->with('error', 'Google login failed.');
        }
    }
}