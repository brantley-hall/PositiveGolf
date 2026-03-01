# Strokes Gained Tracker

A comprehensive web-based application for tracking golf performance using the Strokes Gained methodology. This tool helps golfers analyze their game across four key categories: Off the Tee, Approach Play, Around the Green, and Putting.

## Features

### 🎯 Core Functionality
- **Round Setup**: Configure course details, handicap, and tee box preferences
- **Hole-by-Hole Tracking**: Record detailed statistics for each hole
- **Strokes Gained Calculations**: Automatic calculation of strokes gained/lost in each category
- **Performance Analytics**: Comprehensive statistics and trend analysis
- **Data Export**: Export rounds and statistics to CSV for further analysis

### 📊 Strokes Gained Categories
1. **Off the Tee**: Driving distance and accuracy
2. **Approach Play**: Proximity to hole and Greens in Regulation
3. **Around the Green**: Short game performance from various positions
4. **Putting**: Putting performance based on distance

### 🎨 User Interface
- **Responsive Design**: Works on desktop and mobile devices
- **Professional Layout**: Clean, intuitive interface with Tailwind CSS
- **Real-time Feedback**: Instant strokes gained calculations
- **Visual Indicators**: Color-coded performance metrics

## How to Use

### 1. Setup Your Round
1. Enter course name and date
2. Set course rating/slope and your handicap index
3. Select tee box
4. Click "New Round" to begin

### 2. Record Hole Data
For each hole, enter:
- **Basic Info**: Hole number, par, yardage, score
- **Off the Tee**: Driving distance and fairway hit accuracy
- **Approach**: Proximity to hole and GIR status
- **Around Green**: Starting position and up/down success
- **Putting**: First putt distance and total putts

### 3. Review Performance
- View round summary with total strokes gained
- Analyze performance by category
- Export data for further analysis
- Track trends over multiple rounds

## Strokes Gained Methodology

### Understanding Strokes Gained
Strokes Gained measures your performance against a benchmark (typically scratch golfers or PGA Tour averages):

- **Positive Values**: You gained strokes (better than benchmark)
- **Negative Values**: You lost strokes (worse than benchmark)
- **Zero**: Performed exactly at benchmark level

### Calculation Examples

#### Off the Tee
- **Fairway Hit**: +0.25 strokes
- **Missed Fairway**: -0.25 strokes
- **Distance Bonus**: +0.1 strokes per 10 yards above average

#### Approach Play
- **Green in Regulation**: +0.25 strokes
- **Proximity Bonus**: +0.1 strokes per 10 feet closer than average

#### Around the Green
- **Base Position**: Varies by starting position (fairway, rough, sand, recovery)
- **Up and Down**: +0.25 strokes
- **Failed Up and Down**: -0.25 strokes

#### Putting
- **Performance vs Average**: Based on first putt distance
- **Example**: 25-foot putt average is 2.1, so 2 putts = +0.1 strokes gained

## Data Management

### Local Storage
- **Current Round**: Automatically saved in browser local storage
- **Historical Rounds**: Stored for long-term tracking
- **Recovery**: Data persists between sessions

### Export Capabilities
- **Single Round**: Detailed hole-by-hole data with strokes gained
- **All Statistics**: Aggregate performance across all rounds
- **CSV Format**: Compatible with Excel and spreadsheet applications

## Technical Details

### Technologies Used
- **HTML5**: Semantic markup and modern web standards
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Vanilla JavaScript**: No dependencies, pure JavaScript functionality
- **Font Awesome**: Professional icons and visual elements
- **Local Storage API**: Client-side data persistence

### Browser Compatibility
- **Modern Browsers**: Chrome, Firefox, Safari, Edge
- **Mobile Support**: Responsive design for phones and tablets
- **Offline Capability**: Works without internet connection

### File Structure
```
strokes-gained-tracker/
├── index.html          # Main application interface
├── script.js           # Core JavaScript functionality
├── README.md           # Documentation (this file)
└── data/              # Exported data files (auto-generated)
```

## Getting Started

### Quick Start
1. Clone or download this repository
2. Open `index.html` in your web browser
3. Start tracking your golf performance!

### No Installation Required
- **Web-based**: No software installation needed
- **Portable**: Works from any device with a web browser
- **Privacy-focused**: All data stored locally on your device

## Performance Benchmarks

The application uses simplified benchmark averages for strokes gained calculations:

### Driving Distances
- **Par 4**: 280 yards average
- **Par 5**: 320 yards average

### Approach Proximities
- **< 150 yards**: 18 feet average
- **150-200 yards**: 25 feet average
- **200-250 yards**: 35 feet average
- **> 250 yards**: 45 feet average

### Putting Averages
- **< 10 feet**: 1.2 putts average
- **10-20 feet**: 1.8 putts average
- **20-30 feet**: 2.1 putts average
- **30-40 feet**: 2.3 putts average
- **> 40 feet**: 2.5 putts average

## Future Enhancements

### Planned Features
- **Custom Benchmarks**: User-defined performance targets
- **Handicap Adjustment**: Strokes gained calculations adjusted for handicap
- **Course Database**: Pre-loaded course information
- **Advanced Analytics**: Trend charts and performance graphs
- **Mobile App**: Native mobile application

### Data Integration
- **GPS Integration**: Automatic distance measurement
- **Shot Tracking Integration**: Compatible with shot tracking devices
- **Cloud Sync**: Optional cloud storage for data backup
- **Social Features**: Share rounds with friends and coaches

## Support

### Troubleshooting
- **Data Loss**: Check browser local storage settings
- **Export Issues**: Ensure browser allows file downloads
- **Performance**: Clear browser cache if application slows

### Feedback
- **Bug Reports**: Report issues via GitHub issues
- **Feature Requests**: Suggest enhancements for future versions
- **Questions**: Contact for usage support

## License

This project is open source and available under the MIT License.

---

**Start tracking your golf performance today with professional-grade strokes gained analysis!** ⛳📊
