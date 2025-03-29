import { PET_POSITION_KEY } from "@/utils/storage-keys";
import styles from "./Pet.module.css";
import { Position } from "@/utils/types";
import { MessageType } from "@/utils/message-utils";
import { petData, SinglePetData } from "@/assets/data/pet-data";
import { getMotionStateDuration, PetMotionState } from "@/utils/pet-utils";
import { triggerEvent } from "@/utils/event";
import HeartReaction from "@/components/Reactions/HeartReaction";
import { reactionsData } from "@/assets/data/reactions-data";

const TEST_PET_NAME = "testPet";


const Pet = () => {
  // Used to rerender component
  const [_dummyState, setDummyState] = useState(0);

  const petContainerRef = useRef<HTMLDivElement>(null);
  const petImageRef = useRef<HTMLImageElement>(null);

  const currentPetNameRef = useRef("slime");

  const currentPetRef = useRef<SinglePetData>(
    petData[currentPetNameRef.current]
  );

  const positionRef = useRef({x: 0, y: 0});

  const frameNumberRef = useRef(0);

  const frameElapsedTimeRef = useRef(0);
  const previousTimeRef = useRef(0);

  const motionStateRef = useRef(PetMotionState.IDLE);

  const timeUntilMotionStateChangeMsRef = useRef(1000);

  const moveDirectionRef = useRef(DIRECTION_RIGHT);

  const [isDataLoaded, setIsDataLoaded] = useState(false);

  const triggerRerender = () => {
    setDummyState((dummyState) => dummyState ^ 1);
  };

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

  const isCollidingLeft = (checkEqual = false) => {
    if (
      positionRef.current.x < 0 ||
      (checkEqual && positionRef.current.x === 0)
    ) {
      return 0;
    }
    return NOT_COLLIDING_FLAG;
  };

  const isCollidingRight = (checkEqual = false) => {
    const rightBound = window.innerWidth - petContainerRef.current!.clientWidth;
    if (
      positionRef.current.x > rightBound ||
      (checkEqual && positionRef.current.x === rightBound)
    ) {
      return rightBound;
    }
    return NOT_COLLIDING_FLAG;
  };

  const setMotionState = (newMotionState: PetMotionState) => {
    motionStateRef.current = newMotionState;
    triggerRerender();

    timeUntilMotionStateChangeMsRef.current = getMotionStateDuration(
      currentPetRef.current.activeLevel,
      newMotionState
    );

    frameElapsedTimeRef.current = 0;
    frameNumberRef.current = 0;

    triggerRerender();
  };

  const changeMotionState = () => {
    setMotionState(
      motionStateRef.current === PetMotionState.IDLE
        ? PetMotionState.MOVE
        : PetMotionState.IDLE
    );

    if (isCollidingLeft(true) !== NOT_COLLIDING_FLAG) {
      moveDirectionRef.current = DIRECTION_RIGHT;
    } else if (isCollidingRight(true) !== NOT_COLLIDING_FLAG) {
      moveDirectionRef.current = DIRECTION_LEFT;
    } else {
      moveDirectionRef.current = Math.random() < 0.5 ? DIRECTION_RIGHT : DIRECTION_LEFT;
    }
  };

  const nextSprite = () => {
    const newFrameNumber =
      frameNumberRef.current + 1 >=
      getPetSpriteList(currentPetNameRef.current, motionStateRef.current).length
        ? 0
        : frameNumberRef.current + 1;
    frameNumberRef.current = newFrameNumber;
    triggerRerender();
  };

  const boundPosition = () => {
    if (!petContainerRef.current) {
      return;
    }
    const leftBound = isCollidingLeft();
    if (leftBound !== NOT_COLLIDING_FLAG) {
      positionRef.current = {
        ...positionRef.current,
        x: 0,
      };
      triggerRerender();
    } else {
      const rightBound = isCollidingRight();
      if (rightBound !== NOT_COLLIDING_FLAG) {
        positionRef.current = {
          ...positionRef.current,
          x: rightBound,
        };
        triggerRerender();
      }
    }
    /* setPosition((position) => {
      const rightBound =
        window.innerWidth - petContainerRef.current!.clientWidth;
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
    }); */
  };

  const update = (time: number) => {
    if (previousTimeRef.current !== 0) {
      const deltaTimeMs = time - previousTimeRef.current;
      const deltaTimeSecs = deltaTimeMs / 1000;

      if (timeUntilMotionStateChangeMsRef.current <= 0) {
        changeMotionState();
      }

      if (
        frameElapsedTimeRef.current >=
        petData[currentPetNameRef.current].frameLengthMs
      ) {
        nextSprite();
        frameElapsedTimeRef.current = 0;
      }

      if (motionStateRef.current === PetMotionState.MOVE) {
        positionRef.current = {
          ...positionRef.current,
          x:
            positionRef.current.x +
            petData[currentPetNameRef.current].moveSpeed *
              moveDirectionRef.current *
              deltaTimeSecs,
        };
        triggerRerender();
      }

      boundPosition();

      // saveData();

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
      triggerEvent(reactionsData.heartReaction.eventName);
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
    /* left: position.x,
    bottom: position.y, */
    left: positionRef.current.x,
    bottom: positionRef.current.y,
  };

  const petContainerClasses = `${styles["pet-container"]} ${
    moveDirectionRef.current === -1 && styles["flip-horizontal"]
  }`;

  const petImageClasses = `${styles["pet-image"]}`;

  return (
    <div
      ref={petContainerRef}
      className={petContainerClasses}
      style={positionStyle}
      onClick={handleClick}
      onContextMenu={handleClick}
    >
      {isDataLoaded && (
        <img
          ref={petImageRef}
          className={petImageClasses}
          src={getPetSprite(
            currentPetNameRef.current,
            motionStateRef.current,
            frameNumberRef.current
          )}
        />
      )}
      <HeartReaction />
    </div>
  );
};

export default Pet;
