<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Tymon\JWTAuth\Contracts\JWTSubject;
use Spatie\Permission\Traits\HasRoles;
use Illuminate\Database\Eloquent\SoftDeletes;

class User extends Authenticatable implements JWTSubject
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */

    use HasRoles;
    protected $guard_name = 'api';
    use Notifiable;
    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'google_id',
        'avatar',
        'email_verified_at',
        'is_active',
        'remember_token',
        'must_change_password',
        'survey_completed'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }
    protected $appends = ['full_name'];

    public function getFullNameAttribute()
    {
        return trim("{$this->first_name} {$this->last_name}");
    }

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [
            'roles' => $this->getRoleNames(),
            'permissions' => $this->getAllPermissions()->pluck('name')
        ];
    }

    public function otps()
    {
        return $this->hasMany(Otp::class);
    }

    public function trustedDevices()
    {
        return $this->hasMany(TrustedDevice::class);
    }

    public function studentInformation()
    {
        return $this->hasOne(StudentInformation::class);
    }

    public function notificationPreference()
    {
        return $this->hasOne(NotificationPreference::class);
    }

  
    // for active role
    public function hasActiveRole($roles, string $guard = null): bool
    {
        if (!is_null($this->active_role)) {
            if (is_string($roles)) {
                return $this->active_role === $roles;
            }

            if (is_array($roles)) {
                return in_array($this->active_role, $roles);
            }

            return false;
        }

        return parent::hasRole($roles, $guard);
    }


}
