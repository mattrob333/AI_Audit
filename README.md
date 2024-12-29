# AI Integration Onboarding Flow

A Next.js application that helps businesses plan their AI integration strategy through a guided, step-by-step process.

## Features

- Multi-step onboarding process
- Business and team information collection
- AI-powered questionnaire generation
- Integration plan overview
- Document generation
- Real-time audio transcription
- Modern UI with dark mode support

## Prerequisites

Before running this application, make sure you have:

- Node.js (v14 or higher)
- npm or yarn
- OpenAI API key
- Exa API key

## Environment Variables

Create a `.env.local` file in the root directory with the following variables:

```env
OPENAI_API_KEY=your_openai_api_key
EXA_API_KEY=your_exa_api_key
```

## Installation

1. Clone the repository:
```bash
git clone https://github.com/mattrob333/AI_Audit.git
cd AI_Audit
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Deployment

This project is configured for deployment on Vercel. To deploy:

1. Push your code to GitHub
2. Connect your GitHub repository to Vercel
3. Add the required environment variables in Vercel:
   - `OPENAI_API_KEY`
   - `EXA_API_KEY`
4. Deploy!

## Project Structure

```
/app
  /api          # API routes for OpenAI and Exa integration
  /step-1       # Business information collection
  /step-2       # Team information collection
  /step-3       # AI readiness questionnaire
  /step-4       # Integration plan overview
  /step-5       # Document generation
/components     # Reusable React components
/lib           # Utility functions and API clients
/styles        # Global styles and Tailwind configuration
```

## Tech Stack

- Next.js 14
- TypeScript
- Tailwind CSS
- Shadcn UI
- OpenAI API
- Exa API

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support, please open an issue in the GitHub repository or contact the development team.