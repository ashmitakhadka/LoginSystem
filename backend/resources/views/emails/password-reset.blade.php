<h2>Password Reset</h2>

<p>Hello {{ $user->name }},</p>

<p>We received a request to reset your password.</p>

<p>Please click the link below to reset your password:</p>

<a href="{{ $resetUrl }}">
    Reset Password
</a>

<p>If you did not request a password reset, you can ignore this email.</p>
