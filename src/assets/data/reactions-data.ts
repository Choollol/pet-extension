export type SingleReactionData = {
  eventName: string,
  sprites: string[],
  frameLengthMs: number,
}

export const reactionsData: { [reactionName: string]: SingleReactionData } = {
  heartReaction: {
    eventName: "PlayHeartReaction",
    sprites: [
      browser.runtime.getURL("/sprites/reaction_sprites/heart_reaction/Heart_Reaction_1.png"),
      browser.runtime.getURL("/sprites/reaction_sprites/heart_reaction/Heart_Reaction_2.png"),
      browser.runtime.getURL("/sprites/reaction_sprites/heart_reaction/Heart_Reaction_3.png"),
      browser.runtime.getURL("/sprites/reaction_sprites/heart_reaction/Heart_Reaction_4.png"),
      browser.runtime.getURL("/sprites/reaction_sprites/heart_reaction/Heart_Reaction_5.png"),
      browser.runtime.getURL("/sprites/reaction_sprites/heart_reaction/Heart_Reaction_6.png"),
    ],
    frameLengthMs: 300,
  }
}

export const getReactionSprite = (reactionName: string, frameNumber: number) => {
  return reactionsData[reactionName].sprites[frameNumber];
}