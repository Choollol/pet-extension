#include <fstream>
#include <string>
#include <vector>

#include "ToolUtil.hpp"

/*
ADDING NEW PET PROPERTY:
1 - Add new variable to PetData struct
2 - Write property inside generatePetData()
3 - Add property to SinglePetData in generateSpriteDataTypes()
4 - Update petData in main()
*/

struct PetData {
    std::string internalName;
    std::string externalName;
    unsigned idleSpriteCount;
    unsigned moveSpriteCount;
    unsigned activeLevel = 2;  // Range: 0-5
    unsigned moveSpeed = 20;
    unsigned frameLengthMs = 1000;
};

void generatePetData(const std::string& outputDir, const std::string& fileName, const std::string& fileExtension, const std::vector<PetData>& petData);

int main() {
    std::string outputDir = "../assets/data";

    std::vector<PetData> petData = {
        {"testPet", "Test Pet", 2, 2, 5},
        {"slime", "Slime", 2, 2, 3},
    };

    generatePetData(outputDir, "pet-data", "ts", petData);
}

template <typename T>
void generateObjectProperty(std::ofstream& writer, unsigned indentationAmount, std::string key, T value, bool isString = false);

/**
 * @param spriteType Should be in lowercase. Example: "idle"
 */
void generateSpritePaths(std::ofstream& writer, const PetData& pet, const std::string& spriteType);

void generateSpriteDataTypes(std::ofstream& writer);

void generatePetData(const std::string& outputDir, const std::string& fileName, const std::string& fileExtension, const std::vector<PetData>& petData) {
    std::string path = outputDir + "/" + fileName + "." + fileExtension;

    std::ofstream writer(path);

    writer << "// Generated by tool/GenerateData\n\n";

    generateSpriteDataTypes(writer);

    writer << "export const petData: { [petName: string]: SinglePetData } = {\n";

    for (PetData pet : petData) {
        writer << "\t" << titleToCamelCase(pet.internalName) << ": {\n";

        // Pet name
        generateObjectProperty(writer, 2, "name", pet.externalName, true);

        // Idle sprite paths
        generateSpritePaths(writer, pet, "idle");

        // Move sprite paths
        generateSpritePaths(writer, pet, "move");

        generateObjectProperty(writer, 2, "activeLevel", pet.activeLevel);

        // Length of each frame
        generateObjectProperty(writer, 2, "frameLengthMs", pet.frameLengthMs);

        generateObjectProperty(writer, 2, "moveSpeed", pet.moveSpeed);

        writer << "\t},\n";
    }

    writer << "};\n";
}

template <typename T>
void generateObjectProperty(std::ofstream& writer, unsigned indentationAmount, std::string key, T value, bool isString) {
    while (indentationAmount--) {
        writer << "\t";
    }
    writer << key << ": ";
    if (isString) {
        writer << '"';
    }
    writer << value;
    if (isString) {
        writer << '"';
    }
    writer << ",\n";
}

void generateSpritePaths(std::ofstream& writer, const PetData& pet, const std::string& spriteType) {
    writer << "\t\t" << spriteType << "_sprites: [\n";
    for (unsigned i = 1; i <= pet.idleSpriteCount; ++i) {
        writer << "\t\t\tbrowser.runtime.getURL(\"/sprites/pet_sprites/" << toSnakeCase(pet.internalName) << "/" << spriteType << "/" << toSnakeCase(pet.internalName, true) << "_" << toSnakeCase(spriteType, true) << "_" << i << ".png\"),\n";
    }
    writer << "\t\t],\n";
}

void generateSpriteDataTypes(std::ofstream& writer) {
    writer << "export type SinglePetData = {\n";

    generateObjectProperty(writer, 1, "name", "string");
    generateObjectProperty(writer, 1, "idle_sprites", "string[]");
    generateObjectProperty(writer, 1, "move_sprites", "string[]");
    generateObjectProperty(writer, 1, "activeLevel", "number");
    generateObjectProperty(writer, 1, "frameLengthMs", "number");
    generateObjectProperty(writer, 1, "moveSpeed", "number");

    writer << "}\n\n";
}