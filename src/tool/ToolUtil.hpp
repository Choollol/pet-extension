#ifndef PET_EXTENSION_TOOL_TOOLUTIL_HPP
#define PET_EXTENSION_TOOL_TOOLUTIL_HPP

#include <string>

std::string titleToCamelCase(const std::string& s) {
    if (s.size() == 0) {
        return "";
    }
    std::string result;

    bool doLower = true;

    for (char c : s) {
        if (c == ' ') {
            // Skip spaces
        }
        else if (doLower) {
            result += tolower(c);
            doLower = false;
        }
        else {
            result += c;
        }
    }
    return result;
}

/**
 * @param doCapitalize Whether the first letter of each "word" should be capitalized. Example: sample title -> Sample_Title
 */
std::string toSnakeCase(const std::string& s, const bool doCapitalize = false) {
    std::string result;

    bool doUpper = true;

    for (char c : s) {
        if (c == ' ' || c == '_') {
            result += '_';
            doUpper = true;
        }
        else if (doCapitalize && doUpper) {
            result += toupper(c);
            doUpper = false;
        }
        else if (isupper(c)) {
            result += '_';
            result += doCapitalize ? c : tolower(c);
        }
        else {
            result += tolower(c);
        }
    }
    return result;
}

std::string toTitle(const std::string& s) {
    std::string result;

    bool doUpper = true;

    for (char c : s) {
        if (c == '_' || c == ' ') {
            result += ' ';
            doUpper = true;
        }
        else if (doUpper) {
            result += toupper(c);
            doUpper = false;
        }
        else {
            result += tolower(c);
        }
    }
    return result;
}

#endif