import { PET_POSITION_KEY } from "@/utils/storage-keys";
import styles from "./Pet.module.css";
import { Position } from "@/utils/types";
import { MessageType } from "@/utils/message-utils";
import { petData, SinglePetData } from "@/assets/data/pet-data";
import { getMotionStateDuration, PetMotionState } from "@/utils/pet-utils";
import { triggerEvent } from "@/utils/event";
import HeartReaction from "@/components/Reactions/HeartReaction";
import { reactionsData } from "@/assets/data/reactions-data";

const Pet = () => {
  // Used to rerender component
  const [_dummyState, setDummyState] = useState(0);

  const petContainerRef = useRef<HTMLDivElement>(null);
  const petImageRef = useRef<HTMLImageElement>(null);

  // Internal name
  const currentPetNameRef = useRef(DEFAULT_PET_NAME);

  const currentPetRef = useRef<SinglePetData>(
    petData[currentPetNameRef.current]
  );

  const positionRef = useRef({ x: 0, y: 0 });

  const frameNumberRef = useRef(0);

  const frameElapsedTimeRef = useRef(0);
  const previousTimeRef = useRef(0);

  const motionStateRef = useRef(PetMotionState.IDLE);

  const timeUntilMotionStateChangeMsRef = useRef(1000);

  const moveDirectionRef = useRef(DIRECTION_RIGHT);

  const doShowPetRef = useRef(false);
  const isDataLoadingRef = useRef(false);

  const triggerRerender = () => {
    setDummyState((dummyState) => dummyState ^ 1);
  };

  const disable = () => {
    doShowPetRef.current = false;
    triggerRerender();
  };

  const saveData = async () => {
    await Promise.all([
      storage.setItem(PET_POSITION_KEY, positionRef.current),
      storage.setItem(PET_MOTION_STATE_KEY, motionStateRef.current),
      storage.setItem(
        PET_TIME_UNTIL_MOTION_STATE_CHANGE_KEY,
        timeUntilMotionStateChangeMsRef.current
      ),
      storage.setItem(PET_MOVE_DIRECTION_KEY, moveDirectionRef.current),
      storage.setItem(PET_FRAME_NUMBER_KEY, frameNumberRef.current),
      storage.setItem(PET_FRAME_ELAPSED_TIME, frameElapsedTimeRef.current),
    ]);
  };

  const loadData = async () => {
    if (isDataLoadingRef.current) {
      return;
    }
    doShowPetRef.current = false;
    isDataLoadingRef.current = true;
    triggerRerender();

    const [
      storedPetName,
      storedPosition,
      storedMotionState,
      storedTimeUntilMotionStateChange,
      storedMoveDirection,
      storedFrameNumber,
      storedFrameElapsedTime,
    ] = await Promise.all([
      storage.getItem<string>(CURRENT_PET_NAME_KEY),
      storage.getItem<Position>(PET_POSITION_KEY),
      storage.getItem<PetMotionState>(PET_MOTION_STATE_KEY),
      storage.getItem<number>(PET_TIME_UNTIL_MOTION_STATE_CHANGE_KEY),
      storage.getItem<number>(PET_MOVE_DIRECTION_KEY),
      storage.getItem<number>(PET_FRAME_NUMBER_KEY),
      storage.getItem<number>(PET_FRAME_ELAPSED_TIME),
    ]);
    if (storedPosition) {
      positionRef.current = storedPosition;

      if (storedPetName !== null) {
        currentPetNameRef.current = storedPetName;
      }

      if (storedMotionState !== null) {
        motionStateRef.current = storedMotionState;
      }
      if (storedTimeUntilMotionStateChange !== null) {
        timeUntilMotionStateChangeMsRef.current =
          storedTimeUntilMotionStateChange;
      }
      if (storedMoveDirection !== null) {
        moveDirectionRef.current = storedMoveDirection;
      }
      if (storedFrameNumber !== null) {
        frameNumberRef.current = storedFrameNumber;
      }
      if (storedFrameElapsedTime !== null) {
        frameElapsedTimeRef.current = storedFrameElapsedTime;
      }
    }

    doShowPetRef.current = true;
    isDataLoadingRef.current = false;
    triggerRerender();
  };

  const changePet = (newPetName: string) => {
    currentPetNameRef.current = newPetName;
    triggerRerender();
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

    if (motionStateRef.current === PetMotionState.MOVE) {
      if (isCollidingLeft(true) !== NOT_COLLIDING_FLAG) {
        moveDirectionRef.current = DIRECTION_RIGHT;
      } else if (isCollidingRight(true) !== NOT_COLLIDING_FLAG) {
        moveDirectionRef.current = DIRECTION_LEFT;
      } else {
        moveDirectionRef.current =
          Math.random() < 0.5 ? DIRECTION_RIGHT : DIRECTION_LEFT;
      }
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
    let isColliding = false;
    const leftBound = isCollidingLeft();
    if (leftBound !== NOT_COLLIDING_FLAG) {
      positionRef.current = {
        ...positionRef.current,
        x: 0,
      };
      isColliding = true;
      triggerRerender();
    } else {
      const rightBound = isCollidingRight();
      if (rightBound !== NOT_COLLIDING_FLAG) {
        positionRef.current = {
          ...positionRef.current,
          x: rightBound,
        };
        isColliding = true;
        triggerRerender();
      }
    }

    if (isColliding && motionStateRef.current === PetMotionState.MOVE) {
      moveDirectionRef.current =
        moveDirectionRef.current === DIRECTION_LEFT
          ? DIRECTION_RIGHT
          : DIRECTION_LEFT;
    }
  };

  const update = async (time: number) => {
    if (previousTimeRef.current !== 0) {
      const deltaTimeMs = time - previousTimeRef.current;
      const deltaTimeSecs = deltaTimeMs / 1000;

      if (timeUntilMotionStateChangeMsRef.current <= 0) {
        changeMotionState();
      }

      let currentFrameLengthMs =
        petData[currentPetNameRef.current].idleFrameLengthMs;
      if (motionStateRef.current === PetMotionState.MOVE) {
        positionRef.current = {
          ...positionRef.current,
          x:
            positionRef.current.x +
            petData[currentPetNameRef.current].moveSpeed *
              moveDirectionRef.current *
              deltaTimeSecs,
        };
        currentFrameLengthMs =
          petData[currentPetNameRef.current].moveFrameLengthMs;
        triggerRerender();
      }

      if (frameElapsedTimeRef.current >= currentFrameLengthMs) {
        nextSprite();
        frameElapsedTimeRef.current = 0;
      }

      boundPosition();

      if (doShowPetRef.current) {
        await saveData();
      }

      timeUntilMotionStateChangeMsRef.current -= deltaTimeMs;
      frameElapsedTimeRef.current += deltaTimeMs;
    }
    previousTimeRef.current = time;

    window.requestAnimationFrame(update);
  };

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    // Left click
    if (event.type === "click") {
      triggerEvent(reactionsData.heartReaction.eventName);
    }
    // Right click
    else if (event.type === "contextmenu") {
      triggerEvent(reactionsData.heartReaction.eventName);
    }

    event.preventDefault();

    triggerRerender();
  };

  const init = () => {
    storage.getItem<string>(CURRENT_PET_NAME_KEY).then((currentPetName) => {
      currentPetNameRef.current = currentPetName!;
    });

    browser.runtime.onMessage.addListener(
      async (message, sender, sendResponse) => {
        let wasMessageHandled = false;
        if (message.type === MessageType.LOAD_PET_DATA) {
          await loadData();
          wasMessageHandled = true;
        } else if (message.type === MessageType.STORE_PET_DATA) {
          await saveData();
          wasMessageHandled = true;
        } else if (message.type === MessageType.CHANGE_PET) {
          changePet(message.internalPetName);
          wasMessageHandled = true;
        } else if (message.type === MessageType.DISABLE_PET) {
          disable();
          wasMessageHandled = true;
        } else if (
          message.type === MessageType.CHECK_CONTENT_SCRIPT_EXISTENCE
        ) {
          wasMessageHandled = true;
        }
        if (wasMessageHandled) {
          sendResponse(true);
          return true;
        }
      }
    );
    loadData().then(() => {
      window.requestAnimationFrame(update);
    });
  };

  useEffect(() => {
    init();
  }, []);

  const positionStyle: React.CSSProperties = {
    left: positionRef.current.x,
    bottom: positionRef.current.y,
  };

  let petContainerClasses = `${styles["pet-container"]}`;

  let petImageClasses = `${styles["pet-image"]}`;
  if (moveDirectionRef.current === DIRECTION_LEFT) {
    petImageClasses += ` ${styles["flip-horizontal"]}`;
  }

  return (
    <div
      ref={petContainerRef}
      className={petContainerClasses}
      style={positionStyle}
      onClick={handleClick}
      onContextMenu={handleClick}
    >
      {doShowPetRef.current && (
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
