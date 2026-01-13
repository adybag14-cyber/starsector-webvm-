#!/bin/sh
set -x
# Offline-first Setup for Starsector on WebVM
cd /home/user

echo "Initializing Offline Setup..."
mkdir -p /tmp
chmod 1777 /tmp

# SMART SYMLINK MODE: Wake up the WebDevice
echo "Waking up WebDevice..."
ls /web > /dev/null
sleep 1

echo "Debug: Contents of /web/game:"
ls -F /web/game || echo "Error: /web/game is empty or missing"

HOST_PATH="/web/game"
# Try a few common paths
for SEARCH in "/web/game" "/web/starsector" "/web"; do
    if [ -f "$SEARCH/starsector.sh" ]; then
        HOST_PATH="$SEARCH"
        break
    fi
done

if [ -f "$HOST_PATH/starsector.sh" ]; then
    echo "Found Starsector at $HOST_PATH. Linking files..."
    mkdir -p /home/user/starsector
    
    # Use ls to get items and avoid shell glob expansion issues
    ITEMS=$(ls -1 "$HOST_PATH")
    for name in $ITEMS;
    do
        if [ "$name" != "starsector.sh" ] && [ "$name" != "vmparams" ] && [ "$name" != "index.list" ] && [ "${name#*.}" != "apk" ] && [ "${name#*.}" != "gz" ]; then
            TARGET="/home/user/starsector/$name"
            if [ ! -e "$TARGET" ]; then
                ln -s "$HOST_PATH/$name" "$TARGET"
            fi
        fi
    done
    
    cp "$HOST_PATH/starsector.sh" /home/user/starsector/starsector.sh
    [ -f "$HOST_PATH/vmparams" ] && cp "$HOST_PATH/vmparams" /home/user/starsector/vmparams 2>/dev/null
    echo "Files linked successfully."

    # Only extract compatibility layers if on Alpine (checked by existence of apk)
    if [ -f "/sbin/apk" ]; then
        echo "Extracting compatibility layers for Alpine (offline)..."
        for pkg in "$HOST_PATH"/musl-obstack-*.apk "$HOST_PATH"/libucontext-*.apk "$HOST_PATH"/gcompat-*.apk "$HOST_PATH"/libc6-compat-*.apk;
        do
            [ -f "$pkg" ] && echo "Extracting $pkg..." && tar -C / -xf "$pkg"
        done
        EXTRA_PRELOAD="/lib/libgcompat.so.0"
    else
        echo "Detected non-Alpine environment, skipping compatibility layers."
        EXTRA_PRELOAD=""
    fi

    echo "Extracting Zulu JRE 32-bit..."
    if [ -f "$HOST_PATH/jre32.tar.gz" ]; then
        mkdir -p /home/user/starsector/jre_zulu
        tar -C /home/user/starsector/jre_zulu --strip-components=1 -xf "$HOST_PATH/jre32.tar.gz"
        JAVA_BIN="/home/user/starsector/jre_zulu/bin/java"
    else
        echo "Warning: jre32.tar.gz not found, falling back to bundled JRE"
        JAVA_BIN="./jre_linux_32/bin/java"
    fi
else
    echo "ERROR: Starsector not found in /web/game. Please check host directory."
    exit 1
fi

echo "Configuring Launcher Environment..."
# Ensure the script is executable and uses the specified JRE
if [ -d "/home/user/starsector" ]; then
    sed -i 's/\r//g' /home/user/starsector/starsector.sh
    # Reconstruct starsector.sh
    rm -f /home/user/starsector/starsector.sh.bak
    mv -f /home/user/starsector/starsector.sh /home/user/starsector/starsector.sh.bak
    echo "#!/bin/sh" > /home/user/starsector/starsector.sh
    echo "cd /home/user/starsector" >> /home/user/starsector/starsector.sh
    
    if [ -n "$EXTRA_PRELOAD" ]; then
        echo "export LD_PRELOAD=\"$EXTRA_PRELOAD\"" >> /home/user/starsector/starsector.sh
    fi
    
    # Dynamically find JRE lib paths
    if [ -d "/home/user/starsector/jre_zulu" ]; then
        JRE_LIB_PATHS=$(find /home/user/starsector/jre_zulu/lib -type d | tr '\n' ':')
        echo "export LD_LIBRARY_PATH=$JRE_LIB_PATHS:/usr/lib:/lib" >> /home/user/starsector/starsector.sh
    fi
    
    echo "$JAVA_BIN -Dfile.encoding=UTF-8 -noverify -Xms256m -Xmx512m -Xss1024k -Djava.library.path=./native/linux \\" >> /home/user/starsector/starsector.sh
    echo "    -classpath janino.jar:commons-compiler.jar:commons-compiler-jdk.jar:starfarer.api.jar:starfarer_obf.jar:jogg-0.0.7.jar:jorbis-0.0.15.jar:json.jar:lwjgl.jar:jinput.jar:log4j-1.2.9.jar:lwjgl_util.jar:fs.sound_obf.jar:fs.common_obf.jar:xstream-1.4.2.jar \\" >> /home/user/starsector/starsector.sh
    echo "    com.fs.starfarer.StarfarerLauncher \"\$@\"" >> /home/user/starsector/starsector.sh
    
    chmod +x /home/user/starsector/starsector.sh
fi

echo "------------------------------------------------------------"
echo "Offline Setup Complete!"
echo "To start: cd /home/user/starsector && ./starsector.sh"
echo "------------------------------------------------------------"
