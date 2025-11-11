# 📝 Paragraph Formatter

An interactive web tool for creating aesthetically pleasing paragraph breaks in text with natural variability. This tool intelligently groups sentences into well-balanced paragraphs based on configurable parameters like sentence count, word count, and natural variation.

## Features

- **Intelligent Paragraph Formatting**: Automatically breaks text into paragraphs with optimal sentence and word counts
- **Configurable Parameters**: Adjust minimum/maximum sentences and words per paragraph
- **Natural Variation**: Add randomness to paragraph sizes for a more organic feel
- **Line Break Control**: Customize spacing between paragraphs (0-5 line breaks)
- **Live Preview**: See formatted output update in real-time as you type
- **No Formatting View**: Compare formatted text with a plain, unformatted version
- **Copy to Clipboard**: Easily copy formatted or unformatted text
- **File Upload**: Load text from `.txt` or `.md` files
- **Statistics**: View detailed statistics about your formatted text

## Purpose

This tool is designed to help transform long, unbroken text into well-structured paragraphs that are visually appealing and easy to read. It's particularly useful for:

- Formatting long-form content
- Preparing text for publication
- Improving readability of dense text
- Creating consistent paragraph structures

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd "happy cloud"
```

2. Install dependencies:
```bash
npm install
```

## Running the Project

### Development Mode

Start the development server with hot-reloading:

```bash
npm run dev
```

This will:
- Start a webpack dev server on `http://localhost:8080`
- Automatically open the application in your browser
- Enable hot-reloading for instant updates when you modify code

### Production Build

Build the project for production:

```bash
npm run build
```

This will:
- Compile TypeScript to JavaScript
- Bundle all assets
- Generate an optimized `dist/index.html` file with inline scripts
- Output the final build to the `dist/` directory

The generated `dist/index.html` is a standalone file that can be deployed anywhere or opened directly in a browser.

## Testing

### Manual Testing

1. Start the development server: `npm run dev`
2. Open the application in your browser
3. Test the following features:
   - **Text Input**: Type or paste text into the "Original Text" textarea
   - **File Upload**: Upload a `.txt` or `.md` file
   - **Pre-loaded Samples**: Select from the dropdown (if available)
   - **Configuration Controls**: Adjust paragraph settings and see live updates
   - **Tabs**: Switch between "Formatted Output" and "No Formatting" views
   - **Copy Buttons**: Test copying formatted and unformatted text
   - **Statistics**: Verify statistics are calculated correctly

### Configuration Testing

Test different parameter combinations:
- **Min/Max Sentences**: Try various ranges (e.g., 2-4, 3-6)
- **Min/Max Words**: Test different word count ranges (e.g., 80-120, 100-150)
- **Variations**: Adjust sentence and word variation to see natural randomness
- **Line Breaks**: Test different line break values (0-5) to see spacing changes

## Project Structure

```
happy cloud/
├── src/
│   ├── index.html          # Main HTML template
│   ├── main.ts             # Entry point
│   ├── paragraph-formatter.ts  # Core formatting logic
│   └── ui-inline.ts        # UI interaction handlers
├── dist/                   # Build output (generated)
├── webpack.config.js       # Webpack configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Project dependencies and scripts
└── README.md               # This file
```

## How It Works

1. **Text Parsing**: The tool parses input text into sentences, handling abbreviations (like "Dr.", "Inc.", "Ltd.") correctly
2. **Paragraph Grouping**: Sentences are intelligently grouped into paragraphs based on:
   - Target sentence count per paragraph
   - Target word count per paragraph
   - Natural variation to avoid monotony
3. **Formatting**: Paragraphs are formatted with configurable line breaks between them
4. **Live Updates**: As you type or adjust settings, the output updates in real-time

## Configuration Options

- **Min/Max Sentences**: Control the range of sentences per paragraph
- **Min/Max Words**: Set the desired word count range per paragraph
- **Sentence Variation**: Add randomness to sentence count (±1-10)
- **Word Variation**: Add randomness to word count (±0-30)
- **Line Breaks**: Control spacing between paragraphs (0 = single line, 1 = double line, etc.)

## Browser Support

This tool works in all modern browsers that support:
- ES6+ JavaScript features
- CSS Grid and Flexbox
- Clipboard API (with fallback for older browsers)

## License

MIT

## Author

Created by [Danilo S. Morães](https://www.linkedin.com/in/danilomoraes/)

For issues or comments, please contact: [greendhulke@gmail.com](mailto:greendhulke@gmail.com)

