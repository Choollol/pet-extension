import { petData } from "@/assets/data/pet-data";
import styles from "./App.module.css";
import PetSelectionButton from "@/components/PetSelectionButton/PetSelectionButton";

function App() {
  const [currentSelectedPetName, setCurrentSelectedPetName] = useState(DEFAULT_PET_NAME);

  const init = async () => {
    const petName = await storage.getItem<string>(CURRENT_PET_NAME_KEY);
    setCurrentSelectedPetName(petName ?? currentSelectedPetName);
  }

  useEffect(() => {
    init();
  }, []);

  return (
    <>
      <h1 className={styles["popup-title"]}>Welcome to<br />Muna's Menagerie!</h1>
      <div className={styles["pet-selection-container"]}>
        {Object.keys(petData).map((internalPetName, index) => {
          return (
            <PetSelectionButton
              key={index}
              internalPetName={internalPetName}
              externalPetName={petData[internalPetName].name}
              petThumbnailSprite={petData[internalPetName].thumbnailSprite}
              origin={petData[internalPetName].origin}
              currentSelectedPetName={currentSelectedPetName}
              setCurrentSelectedPetName={setCurrentSelectedPetName}
            />
          );
        })}
      </div>
    </>
  );
}

export default App;
