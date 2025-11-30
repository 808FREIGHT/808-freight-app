# 808 FREIGHT - Project Summary

## Overview
A Next.js web application for comparing freight shipping quotes between Hawaiian Islands and the West Coast. Features a modern UI with ocean blue theme inspired by Hawaiian waters.

## Key Features
- Interactive slideshow of Hawaiian harbors
- Free freight quote comparison tool
- Multi-carrier support (Matson, Pasha, Young Brothers, Hawaiian Air Cargo, Aloha Air Cargo, Pacific Air Cargo, FedEx, UPS, DHL)
- Ocean and air freight options
- Inter-island and West Coast routes

## Color Scheme
- **Primary Blue**: #2B8FBA (ocean blue from Kawaihae Harbor)
- **Background Navy**: #1e3a8a (deep navy blue)
- **Quote Form**: #2B8FBA (ocean blue)
- **Accent**: Same ocean blue throughout for consistency

## Main Components

### Landing Section (First Page)
1. **Slideshow** (30% height)
   - Sticky positioned at top
   - Shows 6 Hawaiian harbor photos (Honolulu, Kawaihae, Hilo, Kahului, Nawiliwili, Kaunakakai)
   - Auto-rotates every 5 seconds
   - No text overlays (clean photo display)
   - Gradient fade at bottom blending into navy background

2. **Logo**
   - Ocean blue colored (#2B8FBA)
   - Width: 560px max
   - Centered display

3. **Statement Section**
   - Tagline: "Hawaii's **ONLY** free freight quote app for inter-Island and West Coast shipping. Compare side-by-side quotes only here at **808 FREIGHT**"
   - "ONLY" highlighted in ocean blue
   - "808 FREIGHT" in large ocean blue text (2.8rem)
   - All text in ocean blue

4. **Call-to-Action**
   - "WE MAKE SHIP HAPPEN" in ocean blue (1.8rem)
   - Ocean blue arrows (↓) above and below
   - Clickable to scroll to quote form

5. **Featured Carriers Section**
   - Navy blue background with shimmer border effect
   - Displays top carriers with logos
   - Ocean blue title and text

6. **Three Steps Section**
   - Ocean blue circles with navy blue numbers (1, 2, 3)
   - Steps: "Submit", "Review", "Choose"
   - Ocean blue text labels

### Quote Form Section
- **Background**: Navy blue (#1e3a8a) page background
- **Form**: Ocean blue background (#2B8FBA)
- **Title**: "Free **808 FREIGHT** Quote" (808 FREIGHT underlined in navy)
- **All labels**: Navy blue text
- **Input fields**: Light backgrounds with navy borders
- **Carrier options**: Selectable with navy text
- **Submit button**: Navy blue

## File Structure
```
808-freight-app/
├── app/
│   ├── page.tsx          # Main page component with all logic
│   ├── globals.css       # All styling including animations
│   ├── layout.tsx        # Root layout
│   └── favicon.ico       # Site icon
├── public/
│   ├── Harbor-*.jpg      # 6 Hawaiian harbor photos
│   ├── *-logo*.png       # Carrier logos
│   └── 808-freight-logo-white.png  # Main logo
├── package.json          # Dependencies
├── next.config.ts        # Next.js configuration
└── tsconfig.json         # TypeScript configuration

```

## Key Technical Details

### Dependencies
- Next.js 16.0.4 with Turbopack
- React 19
- TypeScript
- Tailwind CSS

### Notable CSS Features
- Sticky slideshow with 3D perspective
- Gradient fade effects
- Rolling animation for info section
- Responsive design
- Custom carrier selection UI
- Animated bounce arrows

### Form Features
- Dynamic location selection based on route type
- Carrier-specific fields (container types for Matson/Pasha/YB)
- Form validation
- Email/Phone notification preferences
- Multiple carrier selection with descriptions

### Routes Supported
**Ocean Freight:**
- West Coast to Hawaii
- Hawaii to West Coast  
- Inter-Island

**Air Freight:**
- West Coast to Hawaii
- Hawaii to West Coast
- Inter-Island

### Major Carriers
**Ocean:** Matson, Pasha, Young Brothers
**Air:** Hawaiian Air Cargo, Aloha Air Cargo, Pacific Air Cargo, FedEx, UPS, DHL

## Design Philosophy
- Clean, modern interface inspired by Hawaiian ocean colors
- Unified color scheme using ocean blue throughout
- Minimalist approach (removed city labels from slideshow)
- Mobile responsive
- Professional yet approachable

## How to Run
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Build for Production
```bash
npm run build
npm start
```

---

**Created:** 2025
**Theme:** Hawaiian Ocean Blue (#2B8FBA)
**Status:** Production Ready

