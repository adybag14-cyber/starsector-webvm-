#!/bin/sh
# Offline-first Setup for Starsector on WebVM
cd /home/user

echo "Initializing Offline Setup..."
mkdir -p /tmp
chmod 1777 /tmp

# SMART SYMLINK MODE: Wake up the WebDevice
echo "Waking up WebDevice..."
ls -R /web > /dev/null 2>&1
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
    
    # Symlink data, but copy the launcher scripts to allow local editing
    for item in "$HOST_PATH"/*;
    do
        name=$(basename "$item")
        if [ "$name" != "starsector.sh" ] && [ "$name" != "vmparams" ]; then
            ln -sf "$item" "/home/user/starsector/$name"
        fi
    done
    
    cp "$HOST_PATH/starsector.sh" /home/user/starsector/starsector.sh
    [ -f "$HOST_PATH/vmparams" ] && cp "$HOST_PATH/vmparams" /home/user/starsector/vmparams 2>/dev/null
    echo "Files linked successfully."
else
    echo "ERROR: Starsector not found in /web/game. Please check host directory."
    exit 1
fi

echo "Configuring Launcher Environment..."
# Ensure the script is executable and uses the bundled JRE
if [ -d "/home/user/starsector" ]; then
    sed -i 's/\r//g' /home/user/starsector/starsector.sh
    chmod +x /home/user/starsector/starsector.sh
    
    # Reconstruct starsector.sh to use absolute paths for the bundled JRE
    mv /home/user/starsector/starsector.sh /home/user/starsector/starsector.sh.bak
    echo "#!/bin/sh" > /home/user/starsector/starsector.sh
    echo "cd /home/user/starsector" >> /home/user/starsector/starsector.sh
    
    # Use the bundled jre_linux/bin/java directly
    echo './jre_linux/bin/java -Dfile.encoding=UTF-8 -noverify -Xms1536m -Xmx1536m -Xss1024k \
-Djava.library.path=./native/linux \
-Djava.util.Arrays.useLegacyMergeSort=true \
-Dcom.fs.starfarer.settings.paths.saves=./saves \
-Dcom.fs.starfarer.settings.paths.screenshots=./screenshots \
-Dcom.fs.starfarer.settings.paths.mods=./mods \
-Dcom.fs.starfarer.settings.paths.logs=. \
-classpath "janino.jar:commons-compiler.jar:commons-compiler-jdk.jar:starfarer.api.jar:starfarer_obf.jar:jogg-0.0.7.jar:jorbis-0.0.15.jar:json.jar:lwjgl.jar:jinput.jar:log4j-1.2.9.jar:lwjgl_util.jar:fs.sound_obf.jar:fs.common_obf.jar:xstream-1.4.2.jar" \
com.fs.starfarer.StarfarerLauncher "$@"' >> /home/user/starsector/starsector.sh
    
    chmod +x /home/user/starsector/starsector.sh
fi

echo "------------------------------------------------------------"
echo "Offline Setup Complete!"
echo "To start: cd /home/user/starsector && ./starsector.sh"
echo "------------------------------------------------------------"