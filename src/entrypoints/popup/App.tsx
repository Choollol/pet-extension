import { petData } from "@/assets/data/pet-data";
import "./App.css";
import PetSelectionButton from "@/components/PetSelectionButton/PetSelectionButton";

function App() {
  return (
    <div>
      {Object.keys(petData).map((internalPetName) => {
        const externalPetName = petData[internalPetName].name;
        return (
          <PetSelectionButton
            internalPetName={internalPetName}
            externalPetName={externalPetName}
          />
        );
      })}
    </div>
  );
}

export default App;
