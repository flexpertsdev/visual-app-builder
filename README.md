# Visual App Builder

An AI-powered visual app builder that transforms simple ideas into comprehensive app specifications. Built with React, TypeScript, and AI integration.

![Visual App Builder](https://img.shields.io/badge/React-18.0-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-blue)

## 🚀 Features

- **Visual Canvas System**: Drag-and-drop interface with zoom controls for designing app flows
- **AI-Powered Suggestions**: Proactive AI analysis that suggests features, screens, and improvements
- **Feature Templates**: Pre-built templates for common app features (authentication, chat, e-commerce, etc.)
- **Real-time Persistence**: Automatic saving to localStorage
- **Modern Tech Stack**: React 18, TypeScript, Tailwind CSS, Framer Motion, Zustand

## 🎯 Quick Start

1. Clone the repository:
```bash
git clone https://github.com/flexpertsdev/visual-app-builder.git
cd visual-app-builder
```

2. Install dependencies:
```bash
npm install
```

3. Set up your OpenAI API key:
   - Create a `.env.local` file in the root directory
   - Add your OpenAI API key: `REACT_APP_OPENAI_API_KEY=your-key-here`

4. Start the development server:
```bash
npm start
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS v3
- **State Management**: Zustand
- **Animations**: Framer Motion
- **AI Integration**: OpenAI API
- **Icons**: Lucide React
- **Build Tool**: Create React App

## 📦 Project Structure

```
src/
├── components/          # React components
│   ├── Canvas/         # Canvas-related components
│   ├── Chat/           # AI chat interface
│   ├── Features/       # Feature management
│   ├── Layout/         # Layout components
│   └── UI/             # Reusable UI components
├── services/           # Business logic and API services
├── stores/             # Zustand state stores
├── types/              # TypeScript type definitions
└── styles/             # Global styles
```

## 🎨 Core Components

### Canvas System
- **AppCanvas**: Main canvas component with pan and zoom
- **ScreenCard**: Draggable cards representing app screens
- **ConnectionLines**: Visual connections between screens

### AI Integration
- **AIChat**: Interactive chat interface with the AI assistant
- **AIService**: Service for OpenAI API integration
- **Quick Actions**: AI-suggested actions with one-click implementation

### Feature Management
- **Feature Templates**: Pre-built app features (auth, chat, social, e-commerce)
- **Add Feature Menu**: UI for browsing and adding features

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
REACT_APP_OPENAI_API_KEY=your-openai-api-key
REACT_APP_VERSION=1.0.0
```

### Deploying to Netlify

1. **Never commit your API key to GitHub!**

2. **Set environment variables in Netlify:**
   - Go to your site settings in Netlify
   - Navigate to "Environment variables"
   - Add: `REACT_APP_OPENAI_API_KEY` with your OpenAI API key value

3. **Local development:**
   - Copy `.env.example` to `.env.local`
   - Replace `your-openai-api-key-here` with your actual API key
   - The `.env.local` file is gitignored and won't be committed

### Tailwind Configuration

The project uses a custom Tailwind configuration with:
- Custom color palette (primary, grays, AI purple)
- Extended spacing values
- Custom breakpoints

## 📱 Usage

1. **Create a New App**: Describe your app idea in simple terms (e.g., "WhatsApp but red")
2. **Add Features**: Click the + button to add pre-built features
3. **Drag and Drop**: Arrange screens on the canvas
4. **AI Assistance**: The AI will analyze your project and suggest improvements
5. **Zoom Controls**: Use the zoom buttons to navigate your app design

## 🚀 Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with Create React App
- UI components styled with Tailwind CSS
- State management powered by Zustand
- Animations by Framer Motion
- AI capabilities via OpenAI

## 🐛 Known Issues

- AI features require a valid OpenAI API key
- Canvas performance may vary with large numbers of screens
- Some browsers may have issues with drag-and-drop on touch devices

## 🚧 Roadmap

- [ ] Export to code functionality
- [ ] Collaborative editing
- [ ] More feature templates
- [ ] Advanced AI customization
- [ ] Mobile app preview
- [ ] Integration with design tools

---

Made with ❤️ by [FlexpertsDev](https://github.com/flexpertsdev)