interface Props {
  internalPetName: string;
  externalPetName: string;
}

const PetSelectionButton = ({ internalPetName, externalPetName }: Props) => {
  const handleClick = () => {
  };

  return <button onClick={handleClick}>{externalPetName}</button>;
};

export default PetSelectionButton;
