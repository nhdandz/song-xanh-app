# Song Xanh App (Green Life)

A comprehensive environmental sustainability platform built with Next.js, empowering users to track green activities, reduce their carbon footprint, and connect with an eco-conscious community.

## Overview

Song Xanh (Green Life) is a full-stack web application designed to promote environmental awareness and sustainable living. Users can track their eco-friendly activities, earn points and badges, participate in challenges, scan products for environmental impact, monitor resource usage, and connect with like-minded individuals.

## Key Features

### User Engagement
- **Points & Leveling System**: Earn points for completing green activities and unlock new levels
- **Badges & Achievements**: Collect badges as rewards for reaching milestones
- **Challenges**: Participate in daily and weekly environmental challenges
- **Leaderboards**: Compare your environmental impact with friends and groups

### Green Activity Tracking
- **Activity Logging**: Record and track eco-friendly actions (recycling, using public transport, etc.)
- **Personal Statistics**: Visualize your environmental impact over time with charts
- **Resource Monitoring**: Track electricity and water usage through connected devices
- **Carbon Footprint**: Monitor your carbon and water footprint

### Product Sustainability
- **Barcode/QR Scanner**: Scan products to view their environmental ratings
- **Green Score**: See sustainability metrics including recyclability, biodegradability, and plastic-free status
- **Recommendations**: Get suggestions for more sustainable alternatives

### Community Features
- **Social Feed**: Share your green activities and connect with the community
- **Groups**: Join or create groups (schools, clubs, classes)
- **Friends**: Add friends and see their environmental activities
- **Comments & Likes**: Engage with community posts and ideas

### Environmental Action
- **Report Issues**: Report environmental problems in your area with photos and location
- **Submit Ideas**: Propose and vote on environmental initiatives
- **Interactive Map**: View reported issues and events on a map
- **Events**: Discover and join local environmental events

### Gamification
- **Mini Games**: Learn about sustainability through interactive games
- **Progress Tracking**: Monitor challenge completion and activity streaks

### Admin Panel
- **Dashboard**: Manage users, activities, challenges, and content
- **Analytics**: View platform-wide statistics and user engagement metrics

## Tech Stack

### Frontend
- **Framework**: Next.js 15.3.2
- **UI Library**: React 19
- **Styling**: Tailwind CSS 4
- **Charts**: Chart.js + react-chartjs-2
- **Icons**: React Icons
- **QR Scanner**: html5-qrcode

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **API**: Next.js API Routes

### Development Tools
- **Language**: TypeScript
- **Linting**: ESLint
- **Package Manager**: npm

## Getting Started

### Prerequisites

- Node.js 18+ installed
- PostgreSQL database
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd song-xanh-app
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:

Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://user:password@localhost:5432/songxanh"
```

4. Set up the database:
```bash
# Generate Prisma client
npm run prisma:generate

# Run migrations
npm run prisma:migrate

# Seed the database (optional)
npm run prisma:seed
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build production application
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:generate` - Generate Prisma client
- `npm run prisma:migrate` - Run database migrations
- `npm run prisma:seed` - Seed the database
- `npm run prisma:studio` - Open Prisma Studio

## Database Schema

The application uses a comprehensive database schema including:

- **User Management**: Users, Settings, Friends
- **Green Activities**: GreenActivity, UserActivity
- **Gamification**: Badges, UserBadge, Challenges, UserChallenge
- **Social**: Posts, Comments, Likes
- **Community**: Groups, GroupMembers
- **Environmental**: Reports, Ideas, Events
- **Products**: Product, ScanHistory
- **Resources**: Device, DeviceUsage

For detailed schema information, see `prisma/schema.prisma`.

## Project Structure

```
song-xanh-app/
├── src/
│   ├── app/                 # Next.js app directory
│   │   ├── admin/          # Admin panel pages
│   │   ├── api/            # API routes
│   │   ├── ban-do/         # Map feature
│   │   ├── bao-cao/        # Report issues
│   │   ├── cai-dat/        # Settings
│   │   ├── dang-ky/        # Registration
│   │   ├── dang-nhap/      # Login
│   │   ├── du-an/          # Ideas/projects
│   │   ├── hanh-vi-xanh/   # Green activities
│   │   ├── huy-hieu/       # Badges
│   │   ├── quet-ma/        # QR/barcode scanner
│   │   ├── so-sanh/        # Leaderboards
│   │   ├── thach-thuc/     # Challenges
│   │   ├── thong-ke/       # Statistics
│   │   ├── tiet-kiem/      # Resource savings
│   │   ├── tin-tuc/        # News feed
│   │   ├── tro-choi/       # Games
│   │   └── welcome/        # Welcome page
│   ├── components/         # Reusable React components
│   ├── context/            # React context providers
│   ├── lib/                # Utility functions
│   └── middleware/         # Next.js middleware
├── prisma/
│   ├── schema.prisma       # Database schema
│   └── seed.js             # Database seeder
└── public/                 # Static assets
```

## Features in Detail

### Authentication & User Management
- Secure user registration and login
- Role-based access control (user, admin)
- User profiles with customizable settings
- Reminder notifications for daily activities

### Activity Tracking
- Pre-defined green activities with point values
- Custom activity creation
- Activity history and streaks
- Impact visualization with charts

### Challenge System
- Multiple difficulty levels (Easy, Medium, Hard)
- Category-based challenges
- Progress tracking
- Automatic point rewards upon completion

### Product Scanner
- Real-time barcode scanning
- Comprehensive environmental metrics
- Alternative product suggestions
- Scan history for future reference

### Resource Monitoring
- Electricity usage tracking by device
- Water consumption monitoring
- Usage patterns and recommendations
- Carbon and water footprint calculations

## Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Environment Variables

Required environment variables:

- `DATABASE_URL` - PostgreSQL connection string

## Deployment

### Vercel (Recommended)

The easiest way to deploy is using [Vercel](https://vercel.com):

1. Push your code to GitHub
2. Import the project in Vercel
3. Configure environment variables
4. Deploy

### Manual Deployment

1. Build the application:
```bash
npm run build
```

2. Start the production server:
```bash
npm start
```

## License

This project is private and proprietary.

## Support

For issues, questions, or contributions, please open an issue in the repository.

## Acknowledgments

Built with Next.js, Prisma, and the latest web technologies to create a sustainable future.

---

**Note**: This application is primarily in Vietnamese (Tiếng Việt) to serve the Vietnamese community in their environmental sustainability journey.
