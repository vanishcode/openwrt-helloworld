#include <iostream>
#include <fstream>
#include <string>

int main(int argc, char* argv[]) {
    // 确保传入了文本内容参数
    if (argc < 2) {
        std::cerr << "Usage: " << argv[0] << " <text_to_save>" << std::endl;
        return 1;
    }

    std::string content = argv[1];
    std::ofstream outfile("/tmp/test.txt");

    if (!outfile.is_open()) {
        std::cerr << "Error: Unable to open /tmp/test.txt for writing." << std::endl;
        return 1;
    }

    outfile << content << std::endl;
    outfile.close();

    std::cout << "Success: Content saved to /tmp/test.txt" << std::endl;
    return 0;
}
