@component('mail::message')
# Hello, {{ $user->name }}

Your account has been created. Here are your login credentials:

- **Email:** {{ $user->email }}
- **Password:** {{ $password }}

@component('mail::button', ['url' => url('http://localhost:5173/login')])
Login Now
@endcomponent

Please change your password after logging in.

Thanks,  
{{ config('app.name') }}
@endcomponent
