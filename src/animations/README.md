# Professional Weather Mascot Lottie Animations

## Overview
This directory contains four professional Lottie animations for weather mascots, each designed with unique characteristics and animations based on weather conditions.

## Technical Specifications
- **Format**: Lottie JSON, version 5.9.6
- **Dimensions**: 500x500 pixels
- **Frame Rate**: 30 FPS
- **Duration**: 6-second loop (0-180 frames)
- **Type**: 2D animations only ("ddd": 0)
- **Assets**: No external assets, pure vector shapes and colors

## Animation Features

### 1. Rainy Mascot (🌧️)
**File**: `rainy-mascot-lottie.json`

**Character Design**:
- Blue raincoat with rounded corners
- Brown pants and boots
- Dark hair
- Blue umbrella

**Animations**:
- **Entrance**: Smooth right-to-left slide (frames 0-30)
- **Umbrella**: Scales from 0% to 100% (frames 30-60)
- **Raindrops**: Continuous falling animation (looping)
- **Body Parts**: All elements slide in from right side

**Colors**:
- Coat: Blue (0.2, 0.3, 0.6, 1)
- Pants: Beige (0.9, 0.85, 0.7, 1)
- Boots: Brown (0.4, 0.2, 0.1, 1)
- Hair: Dark (0.1, 0.1, 0.1, 1)
- Umbrella: Light blue (0.1, 0.4, 0.8, 1)
- Raindrops: Blue (0.2, 0.5, 0.9, 1)

### 2. Sunny Mascot (☀️)
**File**: `sunny-mascot-lottie.json`

**Character Design**:
- Yellow shirt (no coat)
- Bright yellow hat
- Sun rays effect

**Animations**:
- **Entrance**: Smooth right-to-left slide (frames 0-30)
- **Hat**: Scales from 0% to 100% (frames 30-60)
- **Sun Rays**: Rotating with opacity fade (frames 30-180)
- **Shimmer Effect**: Opacity pulses from 0 to 100%

**Colors**:
- Shirt: Yellow (0.95, 0.8, 0.5, 1)
- Hat: Bright yellow (1, 0.9, 0.3, 1)
- Sun rays: Orange (1, 0.85, 0.2, 0.3)

### 3. Cold Mascot (❄️)
**File**: `cold-mascot-lottie.json`

**Character Design**:
- Blue winter coat
- Red scarf
- Snowflakes

**Animations**:
- **Entrance**: Smooth right-to-left slide (frames 0-30)
- **Scarf**: Swaying rotation (-5° to +5°, looping)
- **Snowflakes**: Continuous falling animation
- **Scarf Motion**: Smooth back-and-forth sway

**Colors**:
- Coat: Blue (0.2, 0.3, 0.6, 1)
- Scarf: Red (0.8, 0.1, 0.1, 1)
- Snowflakes: White (1, 1, 1, 1)

### 4. Mild Mascot (🌤️)
**File**: `mild-mascot-lottie.json`

**Character Design**:
- Light blue coat
- Simple, relaxed appearance

**Animations**:
- **Entrance**: Smooth right-to-left slide (frames 0-30)
- **Idle Bounce**: Gentle up-down movement (10px range)
- **Relaxed State**: Continuous gentle bouncing
- **No Weather Effects**: Clean, simple animation

**Colors**:
- Coat: Light blue (0.3, 0.4, 0.7, 1)

## Usage in React

```javascript
import lottie from 'lottie-web';
import { rainyMascotAnimation } from './animations';

// Load animation
const animation = lottie.loadAnimation({
  container: containerRef.current,
  renderer: 'svg',
  loop: true,
  autoplay: true,
  animationData: rainyMascotAnimation
});
```

## Animation Timing

### Entrance Animation (All Mascots)
- **Duration**: 1 second (frames 0-30)
- **Movement**: Right-to-left slide from x:600 to x:250
- **Easing**: Smooth cubic-bezier transition

### Character-Specific Animations
- **Rainy**: Umbrella opens (frames 30-60)
- **Sunny**: Hat appears + sun rays (frames 30-180)
- **Cold**: Scarf sways continuously (frames 30-180)
- **Mild**: Gentle bounce (frames 30-180)

### Weather Effects
- **Raindrops**: 2-second loop, continuous falling
- **Sun Rays**: 6-second rotation with opacity fade
- **Snowflakes**: 3-second loop, continuous falling
- **Bounce**: 1-second up-down cycle

## Performance Notes
- All animations are optimized for 30 FPS
- Vector-based graphics ensure scalability
- No external dependencies or assets
- Lightweight JSON files (< 5KB each)
- Smooth looping with no frame drops

## Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Customization
The animations can be easily customized by modifying:
- Colors in the `fill.c.k` arrays
- Timing in the `k` keyframe arrays
- Scale values in the `s` (scale) properties
- Position values in the `p` (position) properties
- Rotation values in the `r` (rotation) properties
