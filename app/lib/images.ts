/**
 * Image presets for common interview topics
 * Uses Unsplash Source API for free, relevant images
 */

export const imagePresets = {
  // Real Estate & Locations
  "costa-rica": "https://source.unsplash.com/800x400/?costa-rica,beach",
  "costa-rica-pacific": "https://source.unsplash.com/800x400/?guanacaste,beach",
  "costa-rica-central": "https://source.unsplash.com/800x400/?san-jose,costa-rica",
  "costa-rica-caribbean": "https://source.unsplash.com/800x400/?caribbean,tropical",
  "real-estate": "https://source.unsplash.com/800x400/?real-estate,house",
  "property": "https://source.unsplash.com/800x400/?property,home",
  "vacation-property": "https://source.unsplash.com/800x400/?vacation,beach-house",

  // Business & Investment
  "investors": "https://source.unsplash.com/800x400/?business,meeting",
  "startup": "https://source.unsplash.com/800x400/?startup,office",
  "funding": "https://source.unsplash.com/800x400/?investment,business",
  "pitch": "https://source.unsplash.com/800x400/?presentation,pitch",
  "seed-round": "https://source.unsplash.com/800x400/?venture-capital,money",

  // Networking & Connections
  "networking": "https://source.unsplash.com/800x400/?networking,people",
  "connections": "https://source.unsplash.com/800x400/?handshake,business",
  "introduction": "https://source.unsplash.com/800x400/?meeting,professional",
  "collaboration": "https://source.unsplash.com/800x400/?teamwork,collaboration",

  // Career & Professional
  "job": "https://source.unsplash.com/800x400/?office,professional",
  "career": "https://source.unsplash.com/800x400/?career,workplace",
  "mentor": "https://source.unsplash.com/800x400/?mentor,coffee",
  "advisor": "https://source.unsplash.com/800x400/?consultant,business",

  // Generic fallbacks
  "question": "https://source.unsplash.com/800x400/?abstract,minimal",
  "success": "https://source.unsplash.com/800x400/?celebration,success",
  "thinking": "https://source.unsplash.com/800x400/?clouds,sky",
};

export type ImagePreset = keyof typeof imagePresets;

/**
 * Get image URL for a topic with optional fallback
 */
export function getImageForTopic(
  topic: string,
  fallback: ImagePreset = "question"
): string {
  const preset = topic.toLowerCase().replace(/\s+/g, "-");
  return imagePresets[preset as ImagePreset] || imagePresets[fallback];
}

/**
 * Get contextual image based on keywords in text
 */
export function getContextualImage(text: string): string {
  const lowerText = text.toLowerCase();

  // Real estate keywords
  if (lowerText.includes("costa rica")) {
    if (lowerText.includes("pacific")) return imagePresets["costa-rica-pacific"];
    if (lowerText.includes("central")) return imagePresets["costa-rica-central"];
    if (lowerText.includes("caribbean")) return imagePresets["costa-rica-caribbean"];
    return imagePresets["costa-rica"];
  }
  if (lowerText.includes("house") || lowerText.includes("property")) {
    return imagePresets["real-estate"];
  }
  if (lowerText.includes("vacation")) {
    return imagePresets["vacation-property"];
  }

  // Business keywords
  if (lowerText.includes("investor") || lowerText.includes("funding")) {
    return imagePresets["investors"];
  }
  if (lowerText.includes("startup")) {
    return imagePresets["startup"];
  }
  if (lowerText.includes("seed") || lowerText.includes("round")) {
    return imagePresets["seed-round"];
  }

  // Networking keywords
  if (lowerText.includes("introduction") || lowerText.includes("intro")) {
    return imagePresets["introduction"];
  }
  if (lowerText.includes("networking") || lowerText.includes("connection")) {
    return imagePresets["networking"];
  }

  // Career keywords
  if (lowerText.includes("job") || lowerText.includes("career")) {
    return imagePresets["career"];
  }
  if (lowerText.includes("mentor") || lowerText.includes("advisor")) {
    return imagePresets["mentor"];
  }

  // Default
  return imagePresets["question"];
}

/**
 * Icon fallbacks for when images aren't needed
 */
export const iconPresets: Record<string, string> = {
  "costa-rica": "🏝️",
  "real-estate": "🏠",
  "property": "🏡",
  "vacation": "🏖️",
  "investors": "💰",
  "startup": "🚀",
  "funding": "💼",
  "networking": "🤝",
  "connections": "🌐",
  "career": "📊",
  "mentor": "👨‍🏫",
  "question": "❓",
  "success": "🎉",
  "thinking": "🤔",
};

export function getIconForTopic(topic: string): string {
  const preset = topic.toLowerCase().replace(/\s+/g, "-");
  return iconPresets[preset] || iconPresets["question"];
}
