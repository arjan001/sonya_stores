# Admin Login Setup Guide

## Problem
Internal server error when logging into the admin panel because there are no admins in the database.

## Solution: Create Default Admin

### Step 1: Set Environment Variables
Create `.env.local` with:
```env
DATABASE_URL=your-neon-database-url
JWT_SECRET=your-secure-random-key
OPENAI_API_KEY=your-openai-key
```

### Step 2: Run Admin Seed Script
```bash
pnpm seed:admin
```

This will create a default admin account with:
- **Email:** `admin@sonyastores.com`
- **Password:** `Admin123!`

### Step 3: Login to Admin Panel
1. Go to `http://localhost:3000/admin/login`
2. Enter the credentials above
3. You'll be redirected to `/admin/dashboard`

### Step 4: Change Password
After first login, change your password immediately in the admin settings.

## How It Works

1. **Admin Registration** - First admin gets `super_admin` role
   - Route: `/api/admin/register`
   - Passwords hashed with PBKDF2

2. **Admin Login** - Uses JWT tokens
   - Route: `/api/admin/login`
   - Token stored in HTTP-only cookie
   - 24-hour expiration

3. **Admin Middleware** - Protects all `/admin/*` routes
   - Verifies JWT token from cookies
   - Redirects to login if not authenticated

## Troubleshooting

### Error: "Invalid email or password"
- Check that admin was created successfully: `pnpm seed:admin`
- Verify database connection: check `DATABASE_URL`

### Error: "Internal server error"
- Check server logs for detailed error message
- Verify all tables exist: `admins`, `admin_sessions`
- Check database permissions

### Can't access admin dashboard after login
- Verify JWT_SECRET is set correctly
- Clear browser cookies and try again
- Check that middleware is protecting the route

## Database Schema

```sql
-- Admins table
CREATE TABLE admins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text UNIQUE NOT NULL,
  name text,
  password_hash text NOT NULL,
  role text NOT NULL, -- 'super_admin' or 'admin'
  is_active boolean DEFAULT true,
  last_login timestamp,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP,
  updated_at timestamp DEFAULT CURRENT_TIMESTAMP
);

-- Admin sessions table
CREATE TABLE admin_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  admin_id uuid NOT NULL REFERENCES admins(id),
  token_hash text,
  expires_at timestamp,
  ip_address text,
  user_agent text,
  created_at timestamp DEFAULT CURRENT_TIMESTAMP
);
```

## API Routes

- `POST /api/admin/login` - Login (no auth required)
- `POST /api/admin/register` - Register new admin (no auth required for first admin)
- `GET /api/admin/users` - List admins (requires auth)
- `PUT /api/admin/users` - Update admin (requires auth, super_admin only)
- `DELETE /api/admin/users` - Delete admin (requires auth, super_admin only)
- `POST /api/admin/users/invite` - Invite new admin (requires auth, super_admin only)

## Next Steps

1. Create your admin account: `pnpm seed:admin`
2. Start dev server: `pnpm dev`
3. Login at `http://localhost:3000/admin/login`
4. Seed products: `pnpm seed:ai-products`
5. View store at `http://localhost:3000`
