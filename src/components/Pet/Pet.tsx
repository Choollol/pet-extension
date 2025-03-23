import { PET_POSITION_KEY } from "@/utils/storage-keys";
import styles from "./Pet.module.css";
import { Position } from "@/utils/types";
import { MessageType } from "@/utils/message-utils";
import { petInfo, SinglePetInfo } from "@/assets/data/pet-info";
import { getMotionStateDuration, PetMotionState } from "@/utils/pet-utils";
import { EVENT_PLAY_HEART_ANIMATION, triggerEvent } from "@/utils/event";
import HeartReaction from "@/components/heart-reaction/HeartReaction";

const TEST_PET_NAME = "testPet";

const Pet = () => {
  const elementRef = useRef<HTMLDivElement>(null);

  const [currentPetName, setCurrentPetName] = useState(TEST_PET_NAME);
  const currentPetRef = useRef<SinglePetInfo>(petInfo[currentPetName]);

  const [position, setPosition] = useState({ x: 0, y: 0 });
  // Use ref also so that saveData() can see updated position. It's called from useEffect() so it can't see updated states.
  const positionRef = useRef(position);

  const [frameNumber, setFrameNumber] = useState(0);
  // Use ref also so that saveData() can see updated frame number. It's called from useEffect() so it can't see updated states.
  const frameNumberRef = useRef(frameNumber);

  const frameElapsedTimeRef = useRef(0);
  const previousTimeRef = useRef(0);

  const motionStateRef = useRef(PetMotionState.IDLE);

  const timeUntilMotionStateChangeMsRef = useRef(1000);

  const moveDirectionRef = useRef(1);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const saveData = () => {
    storage.setItem(PET_POSITION_KEY, positionRef.current);
    storage.setItem(PET_MOTION_STATE_KEY, motionStateRef.current);
    storage.setItem(
      PET_TIME_UNTIL_MOTION_STATE_CHANGE_KEY,
      timeUntilMotionStateChangeMsRef.current
    );
    storage.setItem(PET_MOVE_DIRECTION_KEY, moveDirectionRef.current);
    storage.setItem(PET_FRAME_NUMBER_KEY, frameNumberRef.current);
    storage.setItem(PET_FRAME_ELAPSED_TIME, frameElapsedTimeRef.current);
  };

  const loadData = async () => {
    setIsDataLoaded(false);
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
      setIsDataLoaded(true);
      return;
    }

    setPosition({
      x: storedPosition.x,
      y: storedPosition.y,
    });
    positionRef.current = storedPosition;
    // console.log("Loaded position: " + positionRef.current);

    if (storedMotionState != undefined) {
      motionStateRef.current = storedMotionState;
      // console.log("Loaded motion state: " + motionStateRef.current);
    }
    if (storedTimeUntilMotionStateChange != undefined) {
      timeUntilMotionStateChangeMsRef.current =
        storedTimeUntilMotionStateChange;
      // console.log("Loaded time until motion state change: " + timeUntilMotionStateChangeMsRef.current);
    }
    if (storedMoveDirection != undefined) {
      moveDirectionRef.current = storedMoveDirection;
      // console.log("Loaded stored move direction: " + moveDirectionRef.current);
    }
    if (storedFrameNumber != undefined) {
      setFrameNumber(storedFrameNumber);
      frameNumberRef.current = storedFrameNumber;
      // console.log("Loaded frame number: " + frameNumberRef.current);
    }
    if (storedFrameElapsedTime != undefined) {
      frameElapsedTimeRef.current = storedFrameElapsedTime;
      // console.log("Loaded frame elapsed time: " + frameElapsedTimeRef.current);
    }

    setIsDataLoaded(true);

    // console.log("Data loaded");
  };

  const setMotionState = (newMotionState: PetMotionState) => {
    motionStateRef.current = newMotionState;

    timeUntilMotionStateChangeMsRef.current = getMotionStateDuration(
      currentPetRef.current.activeLevel
    );

    frameElapsedTimeRef.current = 0;
    setFrameNumber((_frameNumber) => 0);
    frameNumberRef.current = 0;
  };

  const changeMotionState = () => {
    setMotionState(
      motionStateRef.current === PetMotionState.IDLE
        ? PetMotionState.MOVE
        : PetMotionState.IDLE
    );

    moveDirectionRef.current = Math.random() < 0.5 ? 1 : -1;
  };

  const nextSprite = () => {
    setFrameNumber((frameNumber) => {
      const newFrameNumber =
        frameNumber + 1 >=
        getPetSpriteList(currentPetName, motionStateRef.current).length
          ? 0
          : frameNumber + 1;
      frameNumberRef.current = newFrameNumber;
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
      positionRef.current = position;
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

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Left click
    if (event.type === "click") {
    }
    // Right click
    else if (event.type === "contextmenu") {
      triggerEvent(EVENT_PLAY_HEART_ANIMATION);
    }

    event.preventDefault();
  };

  useEffect(() => {
    browser.runtime.onMessage.addListener((message) => {
      if (message.type === MessageType.LOAD_PET_DATA) {
        loadData();
      } else if (message.type === MessageType.STORE_PET_DATA) {
        saveData();
      }
    });
    loadData();
    window.requestAnimationFrame(update);
  }, []);

  const positionStyle: React.CSSProperties = {
    left: position.x,
    bottom: position.y,
  };

  const petClasses = `${styles["pet-container"]} ${
    moveDirectionRef.current === -1 && styles["flip-horizontal"]
  }`;

  return (
    <div
      ref={elementRef}
      className={petClasses}
      style={positionStyle}
      onClick={handleClick}
      onContextMenu={handleClick}
    >
      {isDataLoaded && (
        <img
          src={getPetSprite(
            currentPetName,
            motionStateRef.current,
            frameNumber
          )}
        />
      )}
      <HeartReaction />
    </div>
  );
};

export default Pet;
