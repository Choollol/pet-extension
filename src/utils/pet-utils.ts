import { petInfo, SinglePetInfo } from "@/assets/data/pet-info";
import { getRandomInt } from "@/utils/number-utils";

export enum PetMotionState {
  IDLE,
  MOVE,
}

const motionStateDurationRangesSecs = [
  [0, 0],
  [60, 90],
  [30, 50],
  [30, 50],
  [10, 30],
  [3, 6],
]

export function getPetSprite(
  petInternalName: keyof typeof petInfo,
  motionState: PetMotionState,
  spriteIndex: number
): string {
  return getPetSpriteList(petInternalName, motionState)[spriteIndex];
}

export function getPetSpriteList(
  petInternalName: keyof typeof petInfo,
  motionState: PetMotionState
): string[] {
  return petInfo[petInternalName][
    `${PetMotionState[
      motionState
    ].toLowerCase()}_sprites` as keyof SinglePetInfo
  ] as string[];
}

/**
 * @returns The time in milliseconds the pet should stay in the current motion state
 */
export function getMotionStateDuration(activeLevel: number, motionState: PetMotionState): number {
  const range = motionStateDurationRangesSecs[activeLevel];
  // Multiply by 1000 to convert from seconds to milliseconds
  return getRandomInt(range[0], range[1]) * 1000;
}