import styles from "./PetSelectionButton.module.css";

interface Props {
  internalPetName: string;
  externalPetName: string;
  petThumbnailSprite: string;
  origin: string;
  currentSelectedPetName: string;
  setCurrentSelectedPetName: Function;
}

const PetSelectionButton = ({
  internalPetName,
  externalPetName,
  petThumbnailSprite,
  origin,
  currentSelectedPetName: selectedPetName,
  setCurrentSelectedPetName: setSelectedPetName,
}: Props) => {
  const handleClick = async () => {
    const [tab] = await browser.tabs.query({ active: true });
    const message = {
      type: MessageType.CHANGE_PET,
      internalPetName: internalPetName,
    };
    browser.tabs.sendMessage(tab.id!, message);

    setSelectedPetName(internalPetName);
  };

  let buttonClasses = styles["pet-selection-button"];
  if (internalPetName === selectedPetName) {
    buttonClasses += " " + styles["selected-pet-indication"];
  }

  return (
    <button onClick={handleClick} className={buttonClasses}>
      <h4 className={styles["pet-name-text"]}>{externalPetName}</h4>
      <img src={petThumbnailSprite} className={styles["pet-thumbnail-image"]} />
      {/* <p className={styles["origin-text"]}>
        Origin:
        <br />
        {origin}
      </p> */}
    </button>
  );
};

export default PetSelectionButton;
