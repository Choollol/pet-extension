interface Props {
  internalPetName: string;
  externalPetName: string;
}

const PetSelectionButton = ({ internalPetName, externalPetName }: Props) => {
  const handleClick = async () => {
    const [tab] = await browser.tabs.query({ active: true });
    browser.tabs.sendMessage(tab.id!, {
      type: MessageType.CHANGE_PET,
      internalPetName: internalPetName,
    });
  };

  return <button onClick={handleClick}>{externalPetName}</button>;
};

export default PetSelectionButton;
