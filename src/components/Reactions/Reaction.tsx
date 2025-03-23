import { SingleReactionData } from "@/assets/data/reactions-data";
import { startListening } from "@/utils/event";

interface Props {
  reactionData: SingleReactionData;
}

const Reaction = ({ reactionData }: Props) => {
  const isAnimationPlayingRef = useRef(false);

  const playAnimation = async () => {
    if (isAnimationPlayingRef.current) {
      console.log("heart animation already playing");
      return;
    }
    isAnimationPlayingRef.current = true;
    console.log("playing heart animation");

    for (let i = 0; i < reactionData.sprites.length; ++i) {
      
    }

    isAnimationPlayingRef.current = false;
  };

  useEffect(() => {
    startListening(reactionData.eventName, playAnimation);
  }, []);

  return <div></div>;
};

export default Reaction;
