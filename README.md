# CodeScribe AI - Code Transformation Tool

This is a [Next.js](https://nextjs.org) project that provides AI-powered code transformation between different programming languages.

## Features

- **Multi-language Code Conversion**: Transform code between JavaScript, TypeScript, Python, Java, C#, Go, Rust, PHP, Ruby, C++, and Kotlin
- **Rate Limiting**: Built-in rate limiting with real-time display of remaining requests
- **Authentication**: Secure user authentication with NextAuth.js
- **Real-time Feedback**: Live character count and validation
- **Code Sharing**: Share converted code snippets easily
- **Dark/Light Theme**: Toggle between themes for better user experience

## Rate Limiting

The application integrates with the backend's rate limiting system:

### **Backend Integration**
- **API Endpoints**: Uses backend `/api/code/convert` and `/api/code/rate-limits`
- **Rate Limit Headers**: X-RateLimit-Limit, X-RateLimit-Remaining, X-RateLimit-Reset
- **Daily Limits**: 20 requests per 24-hour window
- **Auto Reset**: Limits reset every 24 hours

### **Features**
- **Visual Indicators**: Rate limit status displayed with color-coded alerts
- **Real-time Updates**: Remaining requests shown in real-time
- **Smart Warnings**: Users warned when approaching limits
- **Reset Timer**: Shows when rate limits will reset
- **Profile Dashboard**: Rate limit information in profile page
- **API Protection**: Server-side rate limit enforcement via backend

### **Rate Limit States**
- 🟢 **Normal**: Plenty of requests remaining
- 🟡 **Warning**: Less than 20% of requests remaining  
- 🔴 **Exceeded**: No requests remaining, shows reset timer

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
