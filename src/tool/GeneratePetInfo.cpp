#include <fstream>
#include <string>
#include <vector>

#include "ToolUtil.hpp"

struct PetInfo {
    std::string name;
    unsigned idleSpriteCount;
    unsigned moveSpriteCount;
};

void generatePetInfo(const std::string& outputDir, const std::string& fileName, const std::string& fileExtension, const std::vector<PetInfo>& petInfo);

int main() {
    std::string outputDir = "../assets/data";

    std::vector<PetInfo> petInfo = {
        {"Test Pet", 2, 2}};

    generatePetInfo(outputDir, "pet-info", "ts", petInfo);
}

/**
 * @param spriteType Should be in lowercase. Example: "idle"
 */
void generateSpritePaths(std::ofstream& writer, const PetInfo& pet, const std::string& spriteType) {
    writer << "\t\t" << spriteType << "_sprites: [\n";
    for (unsigned i = 1; i <= pet.idleSpriteCount; ++i) {
        writer << "\t\t\tbrowser.runtime.getURL(\"/pet_sprites/" << toSnakeCase(pet.name) << "/" << spriteType << "/" << toSnakeCase(pet.name, true) << "_" << toSnakeCase(spriteType, true) << "_" << i << ".png\"),\n";
    }
    writer << "\t\t],\n";
}

void generatePetInfo(const std::string& outputDir, const std::string& fileName, const std::string& fileExtension, const std::vector<PetInfo>& petInfo) {
    std::string path = outputDir + "/" + fileName + "." + fileExtension;

    std::ofstream writer(path);

    writer << "export const petInfo = {\n";

    for (PetInfo pet : petInfo) {
        writer << "\t" << titleToCamelCase(pet.name) << ": {\n";

        // Pet name
        writer << "\t\tname: \"" << pet.name << "\",\n";

        // Idle sprite paths
        generateSpritePaths(writer, pet, "idle");
        
        // Move sprite paths
        generateSpritePaths(writer, pet, "move");

        writer << "}\n";
    }

    writer << "};\n";
}