import { petInfo, SinglePetInfo } from "@/assets/data/pet-info";

export enum PetMotionState {
  IDLE,
  MOVE,
}

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