cmake_minimum_required (VERSION 3.11)
project(node_abieos VERSION 2.1 LANGUAGES CXX C)

add_definitions(-DNAPI_VERSION=6)
add_definitions(-DNAPI_EXPERIMENTAL)

include_directories(${CMAKE_JS_INC})

set(default_build_type "Release")
set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)
set(CMAKE_CXX_EXTENSIONS ON)

option(ABIEOS_NO_INT128 "disable use of __int128" OFF)

find_package(Threads)

add_library(abieos STATIC src/abi.cpp src/crypto.cpp include/eosio/fpconv.c)
target_include_directories(abieos PUBLIC include)

if(ABIEOS_NO_INT128)
target_compile_definitions(abieos PUBLIC ABIEOS_NO_INT128)
endif()

set_target_properties(abieos PROPERTIES POSITION_INDEPENDENT_CODE ON)

add_library(${PROJECT_NAME} SHARED src/main.cpp src/abieos.cpp)
set_target_properties(${PROJECT_NAME} PROPERTIES PREFIX "" SUFFIX ".node")
target_link_libraries(${PROJECT_NAME} ${CMAKE_JS_LIB};abieos;${CMAKE_THREAD_LIBS_INIT})
target_compile_options(${PROJECT_NAME} PRIVATE -Wall -Wextra -Wno-unused-parameter -fcolor-diagnostics)

execute_process(COMMAND node -p "require('node-addon-api').include" WORKING_DIRECTORY ${CMAKE_SOURCE_DIR} OUTPUT_VARIABLE NODE_ADDON_API_DIR)
string(REPLACE "\n" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
string(REPLACE "\"" "" NODE_ADDON_API_DIR ${NODE_ADDON_API_DIR})
target_include_directories(${PROJECT_NAME} PRIVATE ${NODE_ADDON_API_DIR})
