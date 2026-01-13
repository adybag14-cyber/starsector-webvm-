# Starsector WebVM Session Summary (Jan 12, 2026)

## 🎯 Primary Objective
Successfully run **Starsector** within a CheerpX-based Alpine Linux environment in the browser with stable networking (Tailscale) and graphical output.

---

## 🏗️ Infrastructure & Security Improvements
We resolved several critical "boot-time" issues that were preventing the VM from initializing correctly.

- **Vite & SvelteKit Security Headers:** 
    - Created `src/hooks.server.js` to force `Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: credentialless`.
    - This enables `SharedArrayBuffer` support, allowing the CheerpX x86-to-Wasm JIT to run at full speed.
- **Service Worker Neutralization:** 
    - Gutted `static/serviceWorker.js` to prevent it from intercepting and breaking internal development traffic.
    - Added an `onMount` script in `+page.svelte` to force-unregister any active zombie workers.
- **Ad-Blocker Resilience:**
    - Converted `plausible.js` to use **dynamic imports** and defensive try/catch blocks.
    - This prevents the entire SvelteKit application from crashing (500 Error) when browser extensions block analytics scripts.
- **Memory Tuning:**
    - Settled on **3GB (3072MB) RAM** as the maximum stable limit for the 32-bit CheerpX engine.

---

## 📦 Starsector & Java Compatibility Fixes
The majority of the session was spent troubleshooting the complexities of running a 32-bit Java application in an emulated Linux environment.

- **Storage Optimization (The 2GB Bypass):**
    - **Problem:** The Alpine image has a hard 2GB limit. Installing Java + Starsector + OS overhead exceeded this capacity, causing the emulator to crash (Fault Inode 809).
    - **Solution:** Implemented **Host-Unzipped Mode** in `static/setup.sh`. By unzipping Starsector on the Windows host, the VM now uses **Smart Symlinks** to run the game data directly from the host SSD, using **0 bytes** of virtual disk space.
- **Java 8 (32-bit) Environment:**
    - Configured the script to install `openjdk8-jre` and `mesa-dri-gallium`.
    - **JVM Scrubbing:** Automatically removes modern JVM flags (Java 14+) like `ShowCodeDetailsInExceptionMessages` and `Xlog:async` that the Starsector launcher tries to use, which are incompatible with Java 8.
    - **Library Pathing:** Dynamically discovers all internal JRE library paths (e.g., `/usr/lib/jvm/.../jre/lib/i386/jli`) and exports them to `LD_LIBRARY_PATH`.
- **Shell Hygiene:**
    - Implemented global **CRLF to LF** conversion for all `.sh` files using `sed -i 's///g'`. This fixed the "not found" loops caused by Windows line endings in the shell scripts.

---

## 🛠️ Current Status & Launch Procedure
The environment is ready. To resume:

1.  **Host Prep:** Ensure `starsector.zip` is unzipped into `static/starsector/starsector/`.
2.  **Disk Reset (CRITICAL):** Click the **Disk Icon** in the sidebar and select **Reset**. This is mandatory to clear out the 1.5GB of junk data from previous crashes and free up the 2GB virtual drive.
3.  **Hard Refresh:** Press **Ctrl + F5** to re-scan the host directory structure.
4.  **Run Setup:**
    ```bash
    sh /web/setup.sh
    ```
    *Expect message: "Found Starsector on Host at /web/starsector/starsector"*
5.  **Launch:**
    ```bash
    cd /home/user/starsector
    ./starsector.sh
    ```
6.  **Switch View:** Click the **Monitor Icon** in the sidebar to view the graphical window (VT7).

---

## 🗒️ Future Considerations
- Monitor `df -h /` during long play sessions to ensure save files don't hit the 2GB overlay limit.
- If performance is sluggish, investigate software rendering optimizations in Mesa.