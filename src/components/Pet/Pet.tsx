import { PET_POSITION_KEY } from "@/utils/storage-keys";
import styles from "./Pet.module.css";
import { Position } from "@/utils/types";
import { MessageType } from "@/utils/message-utils";
import { petInfo } from "@/assets/data/pet-info";

const Pet = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const loadPosition = async () => {
    const storedPosition = await storage.getItem<Position>(PET_POSITION_KEY);
    // console.log(storedPosition);
    if (!storedPosition) {
      return;
    }
    setPosition({
      x: storedPosition.x,
      y: storedPosition.y,
    });
  };

  useEffect(() => {
    browser.runtime.onMessage.addListener((message) => {
      /* if (message.type === MessageType.STORE_PET_POSITION) {
        storePosition();
      } else  */ if (message.type === MessageType.LOAD_PET_POSITION) {
        loadPosition();
      }
    });
    loadPosition();
  }, []);

  const positionStyle: React.CSSProperties = {
    left: position.x,
    bottom: position.y,
  };

  return (
    <div className={styles["pet-container"]} style={positionStyle}>
      <img src={petInfo.testPet.idle_sprites[0]}/>
      {/* {petInfo.testPet.idle_sprites[0]} */}
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

export default Pet;
