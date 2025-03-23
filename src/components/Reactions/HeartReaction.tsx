import { reactionsData } from "@/assets/data/reactions-data";
import Reaction from "@/components/Reactions/Reaction";

const HeartReaction = () => {
  return <Reaction reactionData={reactionsData.heartReaction} />
};

export default HeartReaction;
