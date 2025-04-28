import { petData } from "@/assets/data/pet-data";
import styles from "./App.module.css";
import PetSelectionButton from "@/components/PetSelectionButton/PetSelectionButton";

function App() {
  const [currentSelectedPetName, setCurrentSelectedPetName] = useState(DEFAULT_PET_NAME);

  return (
    <>
      <h1 className={styles["popup-title"]}>Welcome to<br />Muna's Menagerie!</h1>
      <div className={styles["pet-selection-container"]}>
        {Object.keys(petData).map((internalPetName, index) => {
          const externalPetName = petData[internalPetName].name;
          const petThumbnailSprite = petData[internalPetName].thumbnailSprite;
          return (
            <div key={index}>
              <PetSelectionButton
                internalPetName={internalPetName}
                externalPetName={externalPetName}
                petThumbnailSprite={petThumbnailSprite}
                currentSelectedPetName={currentSelectedPetName}
                setCurrentSelectedPetName={setCurrentSelectedPetName}
              />
              <PetSelectionButton
                internalPetName={internalPetName}
                externalPetName={externalPetName}
                petThumbnailSprite={petThumbnailSprite}
                currentSelectedPetName={currentSelectedPetName}
                setCurrentSelectedPetName={setCurrentSelectedPetName}
              />
              <PetSelectionButton
                internalPetName={internalPetName}
                externalPetName={externalPetName}
                petThumbnailSprite={petThumbnailSprite}
                currentSelectedPetName={currentSelectedPetName}
                setCurrentSelectedPetName={setCurrentSelectedPetName}
              />
              <PetSelectionButton
                internalPetName={internalPetName}
                externalPetName={externalPetName}
                petThumbnailSprite={petThumbnailSprite}
                currentSelectedPetName={currentSelectedPetName}
                setCurrentSelectedPetName={setCurrentSelectedPetName}
              />
            </div>
          );
        })}
      </div>
    </>
  );
}

export default App;
