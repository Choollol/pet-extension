import { PET_POSITION_KEY } from "@/utils/storage-keys";
import styles from "./Pet.module.css";
import { Position } from "@/utils/types";
import { MessageType } from "@/utils/message-utils";
import { petInfo } from "@/assets/data/pet-info";
import { PetMotionState } from "@/utils/pet-utils";

const TEST_PET_NAME = "testPet";

const Pet = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  const [currentPetName, setCurrentPetName] = useState(TEST_PET_NAME);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [frameNumber, setFrameNumber] = useState(0);
  const frameElapsedTimeRef = useRef(0);
  const previousTimeRef = useRef(0);

  const motionStateRef = useRef(PetMotionState.IDLE);

  const timeUntilMotionStateChangeMsRef = useRef(1000);

  const moveDirectionRef = useRef(1);

  const loadData = async () => {
    // Load position
    const [
      storedPosition,
      storedMotionState,
      storedTimeUntilMotionStateChange,
      storedMoveDirection,
      storedFrameNumber,
      storedFrameElapsedTime,
    ] = await Promise.all([
      storage.getItem<Position>(PET_POSITION_KEY),
      storage.getItem<PetMotionState>(PET_MOTION_STATE_KEY),
      storage.getItem<number>(PET_TIME_UNTIL_MOTION_STATE_CHANGE_KEY),
      storage.getItem<number>(PET_MOVE_DIRECTION_KEY),
      storage.getItem<number>(PET_FRAME_NUMBER_KEY),
      storage.getItem<number>(PET_FRAME_ELAPSED_TIME),
    ]);
    if (!storedPosition) {
      return;
    }

    setPosition({
      x: storedPosition.x,
      y: storedPosition.y,
    });

    if (storedMotionState != undefined) {
      motionStateRef.current = storedMotionState;
    }
    if (storedTimeUntilMotionStateChange != undefined) {
      timeUntilMotionStateChangeMsRef.current =
        storedTimeUntilMotionStateChange;
    }
    if (storedMoveDirection != undefined) {
      moveDirectionRef.current = storedMoveDirection;
    }
    if (storedFrameNumber != undefined) {
      console.log("stored frame number: " + storedFrameNumber);
      setFrameNumber(storedFrameNumber);
    }
    if (storedFrameElapsedTime != undefined) {
      frameElapsedTimeRef.current = storedFrameElapsedTime;
    }
  };

  const setMotionState = (newMotionState: PetMotionState) => {
    motionStateRef.current = newMotionState;

    timeUntilMotionStateChangeMsRef.current = 4000;

    frameElapsedTimeRef.current = 0;
    setFrameNumber((_frameNumber) => 0);

    storage.setItem(PET_MOTION_STATE_KEY, motionStateRef.current);
    storage.setItem(
      PET_TIME_UNTIL_MOTION_STATE_CHANGE_KEY,
      timeUntilMotionStateChangeMsRef.current
    );
  };

  const changeMotionState = () => {
    setMotionState(
      motionStateRef.current === PetMotionState.IDLE
        ? PetMotionState.MOVE
        : PetMotionState.IDLE
    );

    moveDirectionRef.current = Math.random() < 0.5 ? 1 : -1;

    storage.setItem(PET_MOVE_DIRECTION_KEY, moveDirectionRef.current);
  };

  const nextSprite = () => {
    setFrameNumber((frameNumber) => {
      const newFrameNumber =
        frameNumber + 1 >=
        getPetSpriteList(currentPetName, motionStateRef.current).length
          ? 0
          : frameNumber + 1;
      storage.setItem(PET_FRAME_NUMBER_KEY, newFrameNumber);
      return newFrameNumber;
    });
  };

  const boundPosition = () => {
    if (!elementRef) {
      return;
    }
    setPosition((position) => {
      const rightBound = window.innerWidth - elementRef.current!.clientWidth;
      if (position.x < 0) {
        setMotionState(PetMotionState.IDLE);
        return {
          x: 0,
          y: position.y,
        };
      }
      if (position.x > rightBound) {
        setMotionState(PetMotionState.IDLE);
        return {
          x: rightBound,
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

      storage.setItem(
        PET_TIME_UNTIL_MOTION_STATE_CHANGE_KEY,
        timeUntilMotionStateChangeMsRef.current
      );
      storage.setItem(PET_FRAME_ELAPSED_TIME, frameElapsedTimeRef.current);
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
      ref={elementRef}
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
