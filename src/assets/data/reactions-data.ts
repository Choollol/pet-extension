export const reactionsData = {
  heartReaction: {
    eventName: EVENT_PLAY_HEART_ANIMATION,
    sprites: [
      browser.runtime.getURL("/sprites/reaction_sprites/heart_reaction/Test_Heart_Reaction_1.png"),
      browser.runtime.getURL("/sprites/reaction_sprites/heart_reaction/Test_Heart_Reaction_2.png"),
      browser.runtime.getURL("/sprites/reaction_sprites/heart_reaction/Test_Heart_Reaction_3.png"),
      browser.runtime.getURL("/sprites/reaction_sprites/heart_reaction/Test_Heart_Reaction_4.png"),
    ],
    frameLengthMs: 200,
  }
}