import { petData } from "@/assets/data/pet-data";
import "./App.css";

function App() {
  return (
    <div>
      {Object.keys(petData).map((key) => {
        const petName = petData[key].name;
        return <p>{petName}</p>;
      })}
    </div>
  );
}

export default App;
