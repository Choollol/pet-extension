#include <fstream>
#include <string>
#include <vector>

#include "ToolUtil.hpp"

struct PetInfo {
    std::string internalName;
    std::string externalName;
    unsigned idleSpriteCount;
    unsigned moveSpriteCount;
    unsigned frameLengthMs = 1000;
};

void generatePetInfo(const std::string& outputDir, const std::string& fileName, const std::string& fileExtension, const std::vector<PetInfo>& petInfo);

int main() {
    std::string outputDir = "../assets/data";

    std::vector<PetInfo> petInfo = {
        {"testPet", "Test Pet", 2, 2}};

    generatePetInfo(outputDir, "pet-info", "ts", petInfo);
}

template <typename T>
void generateObjectProperty(std::ofstream& writer, unsigned indentationAmount, std::string key, T value, bool isString = false);

/**
 * @param spriteType Should be in lowercase. Example: "idle"
 */
void generateSpritePaths(std::ofstream& writer, const PetInfo& pet, const std::string& spriteType);

void generateSpriteInfoTypes(std::ofstream& writer);

void generatePetInfo(const std::string& outputDir, const std::string& fileName, const std::string& fileExtension, const std::vector<PetInfo>& petInfo) {
    std::string path = outputDir + "/" + fileName + "." + fileExtension;

    std::ofstream writer(path);

    generateSpriteInfoTypes(writer);

    writer << "export const petInfo: { [petName: string]: SinglePetInfo } = {\n";

    for (PetInfo pet : petInfo) {
        writer << "\t" << titleToCamelCase(pet.internalName) << ": {\n";

        // Pet name
        generateObjectProperty(writer, 2, "name", pet.externalName, true);

        // Idle sprite paths
        generateSpritePaths(writer, pet, "idle");

        // Move sprite paths
        generateSpritePaths(writer, pet, "move");

        // Length of each frame
        generateObjectProperty(writer, 2, "frameLengthMs", pet.frameLengthMs);

        writer << "\t}\n";
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

void generateSpritePaths(std::ofstream& writer, const PetInfo& pet, const std::string& spriteType) {
    writer << "\t\t" << spriteType << "_sprites: [\n";
    for (unsigned i = 1; i <= pet.idleSpriteCount; ++i) {
        writer << "\t\t\tbrowser.runtime.getURL(\"/pet_sprites/" << toSnakeCase(pet.internalName) << "/" << spriteType << "/" << toSnakeCase(pet.internalName, true) << "_" << toSnakeCase(spriteType, true) << "_" << i << ".png\"),\n";
    }
    writer << "\t\t],\n";
}

void generateSpriteInfoTypes(std::ofstream& writer) {
    writer << "export type SinglePetInfo = {\n";

    generateObjectProperty(writer, 1, "name", "string");
    generateObjectProperty(writer, 1, "idle_sprites", "string[]");
    generateObjectProperty(writer, 1, "move_sprites", "string[]");
    generateObjectProperty(writer, 1, "frameLengthMs", "number");

    writer << "}\n\n";
}