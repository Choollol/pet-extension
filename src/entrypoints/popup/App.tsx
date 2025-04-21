import { petData } from "@/assets/data/pet-data";
import styles from "./App.module.css";
import PetSelectionButton from "@/components/PetSelectionButton/PetSelectionButton";

function App() {
  return (
    <>
      <h1 className={styles["popup-title"]}>Welcome to<br />Muna's Menagerie!</h1>
      <div className={styles["pet-selection-container"]}>
        {Object.keys(petData).map((internalPetName) => {
          const externalPetName = petData[internalPetName].name;
          const petThumbnailSprite = petData[internalPetName].thumbnailSprite;
          return (
            <>
              <PetSelectionButton
                internalPetName={internalPetName}
                externalPetName={externalPetName}
                petThumbnailSprite={petThumbnailSprite}
              />
              <PetSelectionButton
                internalPetName={internalPetName}
                externalPetName={externalPetName}
                petThumbnailSprite={petThumbnailSprite}
              />
              <PetSelectionButton
                internalPetName={internalPetName}
                externalPetName={externalPetName}
                petThumbnailSprite={petThumbnailSprite}
              />
              <PetSelectionButton
                internalPetName={internalPetName}
                externalPetName={externalPetName}
                petThumbnailSprite={petThumbnailSprite}
              />
            </>
          );
        })}
      </div>
    </>
  );
}

export default App;
