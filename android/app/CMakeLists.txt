cmake_minimum_required(VERSION 3.4.1)

add_library( libnode
             SHARED
             IMPORTED )
set_target_properties( # Specifies the target library.
                       libnode
                       # Specifies the parameter you want to define.
                       PROPERTIES IMPORTED_LOCATION
                       # Provides the path to the library you want to import.
                       ${CMAKE_SOURCE_DIR}/libnode/bin/${ANDROID_ABI}/libnode.so )

find_library( # Sets the name of the path variable.
              log-lib

              # Specifies the name of the NDK library that
              # you want CMake to locate.
              log )

target_link_libraries( # Specifies the target library.
                       native-lib
                       # Links imported library.
                       libnode
                       # Links the target library to the log library
                       # included in the NDK.
                       ${log-lib} )