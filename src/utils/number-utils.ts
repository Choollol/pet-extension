/**
 * @param min Inclusive
 * @param max Inclusive
 * @returns Random integer between min and max
 */
export function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min);
}