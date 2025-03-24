import { reactionsData } from "@/assets/data/reactions-data";
import Reaction from "@/components/Reactions/Reaction";

const HeartReaction = () => {
  return <Reaction reactionName="heartReaction" reactionData={reactionsData.heartReaction} />
};

export default HeartReaction;
