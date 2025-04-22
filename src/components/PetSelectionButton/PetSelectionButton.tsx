import styles from "./PetSelectionButton.module.css";

interface Props {
  internalPetName: string;
  externalPetName: string;
  petThumbnailSprite: string;
}

const PetSelectionButton = ({
  internalPetName,
  externalPetName,
  petThumbnailSprite,
}: Props) => {
  const handleClick = async () => {
    const [tab] = await browser.tabs.query({ active: true });
    browser.tabs.sendMessage(tab.id!, {
      type: MessageType.CHANGE_PET,
      internalPetName: internalPetName,
    });
  };

  return (
    <button onClick={handleClick} className={styles["pet-selection-button"]}>
      <h4 className={styles["pet-name-text"]}>{externalPetName}</h4>
      <img src={petThumbnailSprite} className={styles["pet-thumbnail-image"]} />
    </button>
  );
};

export default PetSelectionButton;
