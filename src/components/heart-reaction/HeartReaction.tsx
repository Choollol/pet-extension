import { EVENT_PLAY_HEART_ANIMATION, startListening } from "@/utils/event";

interface Props {}

const HeartReaction = ({}: Props) => {
  const isAnimationPlayingRef = useRef(false);

  const playAnimation = () => {
    if (isAnimationPlayingRef.current) {
      console.log("heart animation already playing");
      return;
    }
    isAnimationPlayingRef.current = true;
    console.log("playing heart animation");
    isAnimationPlayingRef.current = false;
  };

  useEffect(() => {
    startListening(EVENT_PLAY_HEART_ANIMATION, playAnimation);
  }, []);

  return <div></div>;
};

export default HeartReaction;
