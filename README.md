# NARRATIVE FRONT

A strategic training simulation for cognitive warfare awareness, developed by Playload.org in collaboration with NATO's Cognitive Warfare Division.

## Overview

Narrative Front teaches players to recognize and counter disinformation tactics in the context of a NATO peacekeeping exercise. Players manage limited resources (manpower) to respond to adversary influence operations while maintaining public unity.

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```

Open http://localhost:5173

### Build for Production
```bash
npm run build
```

Output will be in `/dist` directory.

### Preview Production Build
```bash
npm run preview
```

## Project Structure
```
narrative-front/
├── src/
│   ├── components/       # Reusable UI components
│   ├── screens/          # Main game screens
│   ├── hooks/            # React hooks (state, audio, i18n)
│   ├── utils/            # Helper functions
│   ├── styles/           # CSS files
│   ├── assets/           # Audio, images
│   ├── constants.js      # Game configuration
│   ├── App.jsx           # Main app component
│   └── main.jsx          # Entry point
├── data/
│   ├── scenarios/        # Scenario JSON files (lazy loaded)
│   ├── i18n/             # Translations
│   └── outcomes/         # Outcome templates
├── public/               # Static assets
└── index.html            # HTML shell
```

## Game Mechanics

### Manpower System
- Start with 4 manpower
- Gain +2 manpower each round
- Different responses cost different amounts:
  - Ignore: 0 MP (bank for later)
  - Fact-Check: 2 MP (or 4 MP for thorough)
  - Pre-bunk: 3 MP (invest for future rounds)
  - Counter-Narrative: 3 MP
  - Discredit Source: 2 MP

### Unity Meter
Ranges from -5 (Fragmentation) to +5 (Unity)
- Reach +3 or higher: Victory
- Fall to -3 or lower: Defeat
- End between: Fragile Stability

### Intelligence Dashboard
Each scenario provides 5 metrics:
1. Hours Active (urgency)
2. Bot Amplification % (artificial spread)
3. Damage Potential (1-10 scale)
4. Veracity Assessment (True/Mostly True/Misleading/False)
5. Emotional Resonance (1-10 scale)

## Features

- ✅ 6 handcrafted scenarios with unique challenges
- ✅ Strategic resource management (manpower)
- ✅ AI mentor "Filter" providing tactical guidance
- ✅ Dynamic audio that responds to game state
- ✅ Save/load system (localStorage)
- ✅ Full keyboard navigation support
- ✅ i18n-ready architecture (English + French support planned)
- ✅ Lazy loading for optimal performance
- ✅ Mobile-responsive design

## Accessibility

- Keyboard navigation (Tab, Enter, Esc)
- ARIA labels on interactive elements
- High contrast mode compatible
- Screen reader friendly
- Skippable typewriter effects (click to complete)

## Localization

Currently supports:
- English (en)

Planned:
- French (fr)

To add a language:
1. Create `/data/i18n/{lang}.json`
2. Create `/data/scenarios/scenario-XX-{lang}.json` for each scenario
3. Update language selector in UI

## Performance

- Initial bundle: <100KB gzipped
- Lazy loaded scenarios: ~5-10KB each
- Audio files: Loaded on demand per screen
- Target time-to-interactive: <2s on 3G

## Credits

**Developed by:** Playload.org  
**Classification:** UNCLASSIFIED

## License

[To be determined]

---

**Disclaimer:** This training simulation is designed for educational purposes and does not make any factual claims about actual events. It is not officially endorsed by any organization.