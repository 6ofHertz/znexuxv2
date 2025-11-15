# ZURVAN Local Development Setup

## Prerequisites
- Docker Desktop installed
- Node.js 18+ installed
- Git
- VS Code (recommended)

## Step 1: Clone and Setup

```bash
# Clone the repository
git clone <your-repo-url> zurvan
cd zurvan

# Install dependencies
npm install
```

## Step 2: Start Local PostgreSQL

```bash
# Start PostgreSQL with Docker Compose
docker-compose up -d

# Verify it's running
docker ps

# You should see zurvan-db container running
```

## Step 3: Configure Environment Variables

```bash
# Copy example environment file
cp .env.local.example .env.local

# Edit .env.local with your actual values
```

### Get Firebase Credentials:
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project (or use existing)
3. Enable Authentication → Email/Password provider
4. Enable Storage
5. Go to Project Settings → General
6. Scroll to "Your apps" → Web app
7. Copy the config values to `.env.local`

## Step 4: Initialize Database

```bash
# Run migrations (creates tables)
npm run db:migrate

# Optional: Seed with sample data
npm run db:seed
```

## Step 5: Start Development Server

```bash
npm run dev
```

Your app will be available at `http://localhost:8080`

## VS Code Setup

Install recommended extensions:
- Tailwind CSS IntelliSense
- TypeScript Vue Plugin (Volar)
- Postman
- Docker

## Database Management Commands

```bash
# Start database
docker-compose up -d

# Stop database
docker-compose down

# View database logs
docker-compose logs -f zurvan-db

# Connect to database CLI
docker exec -it zurvan-db psql -U zurvan_user -d zurvan

# Reset database (WARNING: deletes all data)
docker-compose down -v
docker-compose up -d
npm run db:migrate
```

## Package.json Scripts (Add these manually)

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "db:migrate": "docker exec -i zurvan-db psql -U zurvan_user -d zurvan < lib/db/schema/schema.sql",
    "db:seed": "docker exec -i zurvan-db psql -U zurvan_user -d zurvan < lib/db/schema/seed.sql",
    "db:reset": "docker-compose down -v && docker-compose up -d && sleep 5 && npm run db:migrate"
  }
}
```

## Project Structure

```
zurvan/
├── lib/
│   └── db/
│       ├── schema/
│       │   ├── schema.sql       # Database schema
│       │   └── seed.sql         # Sample data
│       └── index.ts             # Database client
├── src/
│   ├── components/              # React components
│   ├── contexts/
│   │   └── AuthContext.tsx      # Firebase auth context
│   ├── lib/
│   │   └── firebase/
│   │       └── config.ts        # Firebase setup
│   ├── pages/                   # Page components
│   └── main.tsx
├── docker-compose.yml           # PostgreSQL setup
├── .env.local                   # Environment variables (DO NOT COMMIT)
└── .env.local.example           # Template for env vars
```

## Troubleshooting

### Database Connection Issues
```bash
# Check if container is running
docker ps

# Check container logs
docker-compose logs zurvan-db

# Restart container
docker-compose restart zurvan-db
```

### Firebase Authentication Issues
- Verify Firebase config in `.env.local`
- Check Firebase Console → Authentication is enabled
- Verify authorized domains in Firebase Console

### Port Already in Use
```bash
# If port 5432 is in use
docker-compose down
# Change port in docker-compose.yml: "5433:5432"
# Update VITE_DATABASE_URL port to 5433
```

## Next Steps

1. Sign up through the app (creates Firebase user + PostgreSQL profile)
2. Add your 5 learning streams
3. Start tracking your learning progress!

## Production Deployment

For production, you'll need:
- PostgreSQL hosting (Railway, Render, Supabase, etc.)
- Update `VITE_DATABASE_URL` to production database
- Firebase project in production mode
- Build and deploy frontend

## Security Notes

- Never commit `.env.local` to Git
- Use strong passwords for production database
- Enable Firebase security rules for Storage
- Keep dependencies updated

## Support

For issues or questions, check:
- Docker logs: `docker-compose logs`
- Browser console for frontend errors
- Database connection with: `docker exec -it zurvan-db psql -U zurvan_user -d zurvan`
