import { PET_POSITION_KEY } from "@/utils/storage-keys";
import styles from "./Pet.module.css";
import { Position } from "@/utils/types";
import { MessageType } from "@/utils/message-utils";
import { petInfo, SinglePetInfo } from "@/assets/data/pet-info";

enum PetMotionState {
  IDLE,
  MOVE,
}

const TEST_PET_NAME = "testPet";

const Pet = () => {
  const [currentPetName, setCurrentPetName] = useState(TEST_PET_NAME);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [motionState, setMotionState] = useState(PetMotionState.IDLE);
  const [frameNumber, setFrameNumber] = useState(0);
  const elapsedTimeRef = useRef(0);
  const previousTimeRef = useRef(0);

  const loadPosition = async () => {
    const storedPosition = await storage.getItem<Position>(PET_POSITION_KEY);
    if (!storedPosition) {
      return;
    }
    setPosition({
      x: storedPosition.x,
      y: storedPosition.y,
    });
  };

  const nextSprite = () => {
    setFrameNumber((frameNumber) =>
      frameNumber + 1 >= getPetSpriteList(currentPetName, motionState).length
        ? 0
        : frameNumber + 1
    );
  };

  const update = (time: number) => {
    if (previousTimeRef.current !== 0) {
      const deltaTime = time - previousTimeRef.current;

      if (elapsedTimeRef.current >= petInfo[currentPetName].frameLengthMs) {
        nextSprite();
        elapsedTimeRef.current = 0;
      }

      elapsedTimeRef.current += deltaTime;
    }
    previousTimeRef.current = time;

    window.requestAnimationFrame(update);
  };

  useEffect(() => {
    browser.runtime.onMessage.addListener((message) => {
      if (message.type === MessageType.LOAD_PET_POSITION) {
        loadPosition();
      }
    });
    loadPosition();
    window.requestAnimationFrame(update);
  }, []);

  const positionStyle: React.CSSProperties = {
    left: position.x,
    bottom: position.y,
  };

  return (
    <div className={styles["pet-container"]} style={positionStyle}>
      <img src={getPetSprite(currentPetName, motionState, frameNumber)} />
      <button
        onClick={() => {
          const newPosition = { x: position.x + 10, y: position.y };
          setPosition(newPosition);
          storage.setItem(PET_POSITION_KEY, newPosition);
        }}
      >
        Move
      </button>
    </div>
  );
};

function getPetSprite(
  petInternalName: keyof typeof petInfo,
  motionState: PetMotionState,
  spriteIndex: number
): string {
  return getPetSpriteList(petInternalName, motionState)[spriteIndex];
}

function getPetSpriteList(
  petInternalName: keyof typeof petInfo,
  motionState: PetMotionState
): string[] {
  return petInfo[petInternalName][
    `${PetMotionState[
      motionState
    ].toLowerCase()}_sprites` as keyof SinglePetInfo
  ] as string[];
}

export default Pet;
