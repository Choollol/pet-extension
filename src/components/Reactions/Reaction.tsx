import {
  getReactionSprite,
  SingleReactionData,
} from "@/assets/data/reactions-data";
import { startListening } from "@/utils/event";
import { waitForMilliseconds } from "@/utils/wait-utils";
import styles from "./Reaction.module.css";

interface Props {
  reactionName: string;
  reactionData: SingleReactionData;
}

const Reaction = ({ reactionName, reactionData }: Props) => {
  const isAnimationPlayingRef = useRef(false);
  const [currentSprite, setCurrentSprite] = useState("");

  const playAnimation = async () => {
    if (isAnimationPlayingRef.current) {
      return;
    }
    isAnimationPlayingRef.current = true;

    for (let i = 0; i < reactionData.sprites.length; ++i) {
      setCurrentSprite((_) => getReactionSprite(reactionName, i));
      await waitForMilliseconds(reactionData.frameLengthMs);
    }
    setCurrentSprite((_) => getReactionSprite(reactionName, 0));
    
    isAnimationPlayingRef.current = false;
  };

  useEffect(() => {
    startListening(reactionData.eventName, playAnimation);
  }, []);

  return (
    <>
      {isAnimationPlayingRef.current && (
        <img className={styles["reaction-image"]} src={currentSprite} />
      )}
    </>
  );
};

export default Reaction;
