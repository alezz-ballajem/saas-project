# GitLab Authentication Setup Guide

This guide will help you set up GitLab OAuth authentication for your GitHub-inspired project management platform.

## Prerequisites

- A GitLab instance running at `gitlab.sonod.tech`
- Admin access to your GitLab instance
- Your Next.js application running

## Step 1: Create a GitLab Application

1. **Log in to your GitLab instance** at `https://gitlab.sonod.tech`

2. **Navigate to User Settings**:
   - Click on your profile picture in the top right
   - Select "Preferences" or "Settings"

3. **Go to Applications**:
   - In the left sidebar, click on "Applications"
   - Or navigate directly to: `https://gitlab.sonod.tech/-/profile/applications`

4. **Create a New Application**:
   - Click "New application"
   - Fill in the following details:
     - **Name**: `GitHub Projects Manager` (or your preferred name)
     - **Redirect URI**: `http://localhost:3000/api/auth/callback/gitlab` (for development)
     - **Scopes**: Select the following scopes:
       - `read_user` - Read user information
       - `read_api` - Read API data
       - `api` - Full API access

5. **Save the Application**:
   - Click "Save application"
   - **Important**: Copy the `Application ID` and `Secret` - you'll need these for your environment variables

## Step 2: Configure Environment Variables

Create or update your `.env.local` file in your project root with the following variables:

```bash
# GitLab OAuth Configuration
GITLAB_HOST=https://gitlab.sonod.tech
GITLAB_CLIENT_ID=your_application_id_here
GITLAB_CLIENT_SECRET=your_secret_here

# NextAuth Configuration (for session management)
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_random_secret_here

# Database Configuration
DATABASE_URL=your_database_connection_string
```

### Generating NEXTAUTH_SECRET

You can generate a secure secret using the provided script:

```bash
node scripts/generate-secret.js
```

Or generate one manually:

```bash
openssl rand -base64 32
```

## Step 3: Update Database Schema

Run the Prisma migration to ensure your database schema is up to date:

```bash
npx prisma generate
npx prisma db push
```

## Step 4: Test the Authentication

1. **Start your development server**:
   ```bash
   npm run dev
   ```

2. **Navigate to your application**:
   - Open `http://localhost:3000` in your browser
   - Click "Get Started" or "Sign In"

3. **Test the OAuth flow**:
   - You should be redirected to `gitlab.sonod.tech`
   - Log in with your GitLab credentials
   - Authorize the application
   - You should be redirected back to your dashboard

## Step 5: Production Configuration

For production deployment, update the following:

1. **Update Redirect URI in GitLab**:
   - Go back to your GitLab application settings
   - Add your production domain: `https://yourdomain.com/api/auth/callback/gitlab`
   - Update the redirect URI to use HTTPS

2. **Update Environment Variables**:
   ```bash
   NEXTAUTH_URL=https://yourdomain.com
   GITLAB_CLIENT_ID=your_production_application_id
   GITLAB_CLIENT_SECRET=your_production_secret
   ```

## Troubleshooting

### Common Issues

1. **"Invalid redirect URI" error**:
   - Ensure the redirect URI in GitLab matches exactly: `http://localhost:3000/api/auth/callback/gitlab`
   - Check for trailing slashes or protocol mismatches

2. **"Client authentication failed" error**:
   - Verify your `GITLAB_CLIENT_ID` and `GITLAB_CLIENT_SECRET` are correct
   - Ensure there are no extra spaces or characters

3. **"Access denied" error**:
   - Check that you've selected the correct scopes in GitLab
   - Ensure your GitLab user has the necessary permissions

4. **Database connection issues**:
   - Verify your `DATABASE_URL` is correct
   - Run `npx prisma db push` to update the schema

### Debug Mode

To enable debug logging, add this to your `.env.local`:

```bash
DEBUG=true
```

## Security Considerations

1. **Environment Variables**:
   - Never commit `.env.local` to version control
   - Use different secrets for development and production
   - Rotate secrets regularly

2. **HTTPS in Production**:
   - Always use HTTPS in production
   - Update GitLab redirect URIs to use HTTPS

3. **Scopes**:
   - Only request the minimum required scopes
   - Regularly review and audit application permissions

## API Endpoints

The authentication system provides the following endpoints:

- `GET /api/auth/signin` - Initiate GitLab OAuth flow
- `GET /api/auth/callback/gitlab` - OAuth callback handler
- `GET /api/auth/session` - Get current session
- `POST /api/auth/signout` - Sign out user

## User Data

The system stores the following user information from GitLab:

- `gitlabId` - Unique GitLab user ID
- `name` - User's display name
- `email` - User's email address
- `image` - User's avatar URL
- `role` - User role (defaults to 'USER')

## Support

If you encounter any issues:

1. Check the browser console for error messages
2. Check your server logs for detailed error information
3. Verify all environment variables are set correctly
4. Ensure your GitLab instance is accessible and properly configured

For additional help, refer to the [GitLab OAuth documentation](https://docs.gitlab.com/ee/integration/oauth_provider.html).