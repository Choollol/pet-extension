export type SingleReactionData = {
  eventName: string,
  sprites: string[],
  frameLengthMs: number,
}

export const reactionsData: { [reactionName: string]: SingleReactionData } = {
  heartReaction: {
    eventName: "PlayHeartReaction",
    sprites: [
      browser.runtime.getURL("/sprites/reaction_sprites/heart_reaction/Test_Heart_Reaction_1.png"),
      browser.runtime.getURL("/sprites/reaction_sprites/heart_reaction/Test_Heart_Reaction_2.png"),
      browser.runtime.getURL("/sprites/reaction_sprites/heart_reaction/Test_Heart_Reaction_3.png"),
      browser.runtime.getURL("/sprites/reaction_sprites/heart_reaction/Test_Heart_Reaction_4.png"),
    ],
    frameLengthMs: 200,
  }
}