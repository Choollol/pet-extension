import { PET_POSITION_KEY } from "@/utils/storage-keys";
import styles from "./Pet.module.css";
import { Position } from "@/utils/types";
import { MessageType } from "@/utils/message-utils";
import { petInfo } from "@/assets/data/pet-info";
import { PetMotionState } from "@/utils/pet-utils";

const TEST_PET_NAME = "testPet";

const Pet = () => {
  const [currentPetName, setCurrentPetName] = useState(TEST_PET_NAME);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [frameNumber, setFrameNumber] = useState(0);
  const frameElapsedTimeRef = useRef(0);
  const previousTimeRef = useRef(0);

  const motionStateRef = useRef(PetMotionState.IDLE);

  const timeUntilMotionStateChangeMsRef = useRef(3000);

  const moveDirectionRef = useRef(1);

  const loadData = async () => {
    const storedPosition = await storage.getItem<Position>(PET_POSITION_KEY);
    if (!storedPosition) {
      return;
    }
    setPosition({
      x: storedPosition.x,
      y: storedPosition.y,
    });
  };

  const changeMotionState = () => {
    motionStateRef.current =
      motionStateRef.current === PetMotionState.IDLE
        ? PetMotionState.MOVE
        : PetMotionState.IDLE;
    timeUntilMotionStateChangeMsRef.current = 3000;

    moveDirectionRef.current = Math.random() < 0.5 ? 1 : -1;

    frameElapsedTimeRef.current = 0;
    setFrameNumber((frameNumber) => 0);
  };

  const nextSprite = () => {
    setFrameNumber((frameNumber) =>
      frameNumber + 1 >=
      getPetSpriteList(currentPetName, motionStateRef.current).length
        ? 0
        : frameNumber + 1
    );
  };

  const boundPosition = () => {
    setPosition((position) => {
      if (position.x <= 0) {
        return {
          x: 0,
          y: position.y,
        };
      }
      if (position.x >= window.innerWidth - 32) {
        return {
          x: window.innerWidth - 32,
          y: position.y,
        };
      }
      return position;
    });
  };

  const update = (time: number) => {
    if (previousTimeRef.current !== 0) {
      const deltaTimeMs = time - previousTimeRef.current;
      const deltaTimeSecs = deltaTimeMs / 1000;

      if (timeUntilMotionStateChangeMsRef.current <= 0) {
        changeMotionState();
      }

      if (
        frameElapsedTimeRef.current >= petInfo[currentPetName].frameLengthMs
      ) {
        nextSprite();
        frameElapsedTimeRef.current = 0;
      }

      if (motionStateRef.current === PetMotionState.MOVE) {
        setPosition((position) => {
          const newPosition = {
            ...position,
            x:
              position.x +
              petInfo[currentPetName].moveSpeed *
                moveDirectionRef.current *
                deltaTimeSecs,
          };
          storage.setItem(PET_POSITION_KEY, newPosition);
          return newPosition;
        });
      }

      boundPosition();

      timeUntilMotionStateChangeMsRef.current -= deltaTimeMs;
      frameElapsedTimeRef.current += deltaTimeMs;
    }
    previousTimeRef.current = time;

    window.requestAnimationFrame(update);
  };

  useEffect(() => {
    browser.runtime.onMessage.addListener((message) => {
      if (message.type === MessageType.LOAD_PET_POSITION) {
        loadData();
      }
    });
    loadData();
    window.requestAnimationFrame(update);
  }, []);

  const positionStyle: React.CSSProperties = {
    left: position.x,
    bottom: position.y,
  };

  return (
    <div
      className={`${styles["pet-container"]} ${
        moveDirectionRef.current === -1 && styles["flip-horizontal"]
      }`}
      style={positionStyle}
    >
      <img
        src={getPetSprite(currentPetName, motionStateRef.current, frameNumber)}
      />
    </div>
  );
};



export default Pet;
