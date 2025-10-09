/**
 * Get color values from theme palette
 * @param {object} theme - MUI theme object
 * @param {string} color - Color key from palette (primary, secondary, success, warning, error, info)
 * @returns {object} Color object with main, light, dark, lighter, darker properties
 */
export default function getColors(theme, color = 'primary') {
  const colors = theme.palette[color];

  if (!colors) {
    // Fallback to primary if color doesn't exist
    return theme.palette.primary;
  }

  return colors;
}
