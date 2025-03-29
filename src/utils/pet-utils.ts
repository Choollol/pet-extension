import { petData, SinglePetData } from "@/assets/data/pet-data";
import { getRandomInt } from "@/utils/number-utils";

export enum PetMotionState {
  IDLE,
  MOVE,
}

export const DIRECTION_LEFT = -1;
export const DIRECTION_RIGHT = 1;

export const NOT_COLLIDING_FLAG = -1;

const idleStateDurationRangesSecs = [
  [0, 0],
  [60, 90],
  [30, 50],
  [30, 50],
  [10, 30],
  [3, 6],
]

const moveStateDurationRangesSecs = [
  [0, 0],
  [2, 4],
  [3, 5],
  [4, 7],
  [6, 9],
]

export function getPetSprite(
  petInternalName: keyof typeof petData,
  motionState: PetMotionState,
  spriteIndex: number
): string {
  return getPetSpriteList(petInternalName, motionState)[spriteIndex];
}

export function getPetSpriteList(
  petInternalName: keyof typeof petData,
  motionState: PetMotionState
): string[] {
  return petData[petInternalName][
    `${PetMotionState[
      motionState
    ].toLowerCase()}_sprites` as keyof SinglePetData
  ] as string[];
}

/**
 * @returns The time in milliseconds the pet should stay in the current motion state
 */
export function getMotionStateDuration(activeLevel: number, motionState: PetMotionState): number {
  let range;
  if (motionState === PetMotionState.IDLE) {
    range = idleStateDurationRangesSecs[activeLevel];
  }
  else {
    range = moveStateDurationRangesSecs[activeLevel];
  }
  // Multiply by 1000 to convert from seconds to milliseconds
  return getRandomInt(range[0], range[1]) * 1000;
}