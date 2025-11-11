// Browser-compatible paragraph formatter library

// Types for better type safety
interface Sentence {
  text: string;
  wordCount: number;
}

interface ParagraphConfig {
  minSentences: number;
  maxSentences: number;
  minWords: number;
  maxWords: number;
  lineBreaks: number;
}

interface NoiseConfig {
  sentenceVariation: number; // ±1-2 sentences
  wordVariation: number;     // ±10-20 words
}

/**
 * ParagraphFormatter class for creating aesthetically pleasing paragraph breaks
 */
export class ParagraphFormatter {
  private readonly defaultConfig: ParagraphConfig = {
    minSentences: 2,
    maxSentences: 4,
    minWords: 80,
    maxWords: 120,
    lineBreaks: 1
  };
  
  private readonly defaultNoiseConfig: NoiseConfig = {
    sentenceVariation: 4, // ±4 sentences variation
    wordVariation: 10     // ±10 words variation
  };

  private readonly abbreviations = [
    'Dr', 'Prof', 'Mr', 'Mrs', 'Ms', 'Rev', 'Sr', 'Jr', 'Ph.D', 'M.D', 'B.A', 'M.A', 'B.S', 'M.S',
    'U.S', 'U.S.A', 'U.K', 'U.N', 'N.A.T.O', 'F.B.I', 'C.I.A', 'N.S.A', 'D.O.D', 'D.O.J',
    'Inc', 'Corp', 'Ltd', 'Co', 'LLC', 'LLP', 'etc', 'vs', 'i.e', 'e.g', 'a.m', 'p.m', 'A.M', 'P.M',
    'St', 'Ave', 'Blvd', 'Rd', 'Dr', 'Ct', 'Ln', 'Pl', 'Sq', 'Pkwy', 'Hwy',
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
    'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun',
    'No', 'Nos', 'Vol', 'pp', 'p', 'ch', 'sec', 'fig', 'ref', 'eq', 'ex'
  ];

  /**
   * Simple noise function for natural variability
   * Returns values between -1 and 1
   */
  private simpleNoise(x: number): number {
    const n = Math.sin(x * 12.9898) * 43758.5453;
    return (n - Math.floor(n)) * 2 - 1;
  }

  /**
   * Parse text into sentences
   */
  public parseSentences(text: string): Sentence[] {
    const normalizedText = text.replace(/\s+/g, ' ').trim();
    
    // Create regex pattern for abbreviations
    const abbrevPattern = this.abbreviations.map(abbr => 
      abbr.replace(/\./g, '\\.') + '\\.'
    ).join('|');
    
    // Split on sentence endings, but not after abbreviations
    let sentences = normalizedText.split(/(?<=[.!?])\s+/);
    
    // Filter out false splits caused by abbreviations
    const filteredSentences = [];
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i].trim();
      if (sentence.length === 0) continue;
      
      // Check if this sentence ends with an abbreviation
      const endsWithAbbrev = new RegExp(`\\b(${abbrevPattern})\\s*$`, 'i').test(sentence);
      
      if (endsWithAbbrev && i < sentences.length - 1) {
        // Merge with next sentence
        const nextSentence = sentences[i + 1].trim();
        sentences[i + 1] = sentence + ' ' + nextSentence;
      } else {
        filteredSentences.push(sentence);
      }
    }
    
    return filteredSentences
      .filter(sentence => sentence.trim().length > 0)
      .map(sentence => ({
        text: sentence.trim(),
        wordCount: sentence.trim().split(/\s+/).length
      }));
  }

  /**
   * Calculate target paragraph size with noise
   */
  private calculateTargetSize(
    baseSentences: number,
    baseWords: number,
    noiseX: number,
    config: ParagraphConfig,
    noiseConfig: NoiseConfig
  ): { sentences: number; words: number } {
    // Generate noise values
    const sentenceNoise = this.simpleNoise(noiseX) * noiseConfig.sentenceVariation;
    const wordNoise = this.simpleNoise(noiseX + 100) * noiseConfig.wordVariation;
    
    // Apply noise to base values
    const targetSentences = Math.round(baseSentences + sentenceNoise);
    const targetWords = Math.round(baseWords + wordNoise);
    
    // Clamp to valid ranges
    return {
      sentences: Math.max(config.minSentences, Math.min(config.maxSentences, targetSentences)),
      words: Math.max(config.minWords, Math.min(config.maxWords, targetWords))
    };
  }

  /**
   * Group sentences into paragraphs based on aesthetic criteria
   */
  private groupIntoParagraphs(
    sentences: Sentence[],
    config: ParagraphConfig,
    noiseConfig: NoiseConfig
  ): string[][] {
    const paragraphs: string[][] = [];
    let currentParagraph: string[] = [];
    let currentWordCount = 0;
    let noiseX = 0;
    
    // Calculate base targets (middle of ranges)
    const baseSentences = (config.minSentences + config.maxSentences) / 2;
    const baseWords = (config.minWords + config.maxWords) / 2;
    
    for (let i = 0; i < sentences.length; i++) {
      const sentence = sentences[i];
      
      // Calculate target size for this paragraph
      const target = this.calculateTargetSize(baseSentences, baseWords, noiseX, config, noiseConfig);
      
      // Check if adding this sentence would exceed our targets
      const wouldExceedSentences = currentParagraph.length >= target.sentences;
      const wouldExceedWords = currentWordCount + sentence.wordCount > target.words;
      
      // If we have at least minimum sentences and would exceed targets, start new paragraph
      if (currentParagraph.length >= config.minSentences && (wouldExceedSentences || wouldExceedWords)) {
        paragraphs.push([...currentParagraph]);
        currentParagraph = [];
        currentWordCount = 0;
        noiseX += 1; // Increment noise for next paragraph
      }
      
      // Add sentence to current paragraph
      currentParagraph.push(sentence.text);
      currentWordCount += sentence.wordCount;
    }
    
    // Add remaining sentences as final paragraph
    if (currentParagraph.length > 0) {
      paragraphs.push(currentParagraph);
    }
    
    return paragraphs;
  }

  /**
   * Format paragraphs with proper spacing
   */
  private formatParagraphs(paragraphs: string[][], lineBreaks: number): string {
    // lineBreaks: 0 = single line break (\n), 1 = double line break (\n\n), etc.
    const separator = '\n' + '\n'.repeat(lineBreaks);
    return paragraphs
      .map(paragraph => paragraph.join(' '))
      .join(separator);
  }

  /**
   * Main method to format text into aesthetically pleasing paragraphs
   */
  public formatTextIntoParagraphs(text: string, userConfig?: Partial<ParagraphConfig & NoiseConfig>): string {
    // Merge user config with defaults
    const config: ParagraphConfig = { ...this.defaultConfig, ...userConfig };
    const noiseConfig: NoiseConfig = { 
      sentenceVariation: userConfig?.sentenceVariation ?? this.defaultNoiseConfig.sentenceVariation,
      wordVariation: userConfig?.wordVariation ?? this.defaultNoiseConfig.wordVariation
    };
    
    // Parse sentences
    const sentences = this.parseSentences(text);
    
    if (sentences.length === 0) {
      return text;
    }
    
    // Group into paragraphs
    const paragraphs = this.groupIntoParagraphs(sentences, config, noiseConfig);
    
    // Format and return
    return this.formatParagraphs(paragraphs, config.lineBreaks);
  }

  /**
   * Get current default configuration
   */
  public getDefaultConfig(): ParagraphConfig {
    return { ...this.defaultConfig };
  }

  /**
   * Get current default noise configuration
   */
  public getDefaultNoiseConfig(): NoiseConfig {
    return { ...this.defaultNoiseConfig };
  }
}

