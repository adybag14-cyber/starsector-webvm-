# Starsector WebVM (Alpine Linux)

This project is a rebuild of the CheerpX WebVM running Alpine Linux with a graphical UI, specifically set up to run Starsector and Tailscale.

## Getting Started

1.  **Install Dependencies:**
    ```bash
    npm install
    ```

2.  **Run Development Server:**
    ```bash
    npm run dev
    ```

3.  **Access the VM:**
    Open your browser to `http://localhost:5173/alpine`

## Starsector & Tailscale Binaries

- **Tailscale:** The Tailscale Linux x86 static binary (`tailscale.tgz`) is included (v1.70.0).
- **Starsector:** Starsector 0.98a-RC8 (Linux) is included as `starsector.zip`.

## Installing inside the VM

Once the VM has booted and you are at the command prompt (or in `xterm` in the GUI):

1.  Run the setup script:
    ```bash
    sh /web/setup.sh
    ```

2.  This will:
    -   Extract Starsector to `/home/user/starsector`
    -   Extract Tailscale to `/home/user/tailscale`

3.  **To run Starsector:**
    ```bash
    cd /home/user/starsector
    ./starsector.sh
    ```

4.  **To run Tailscale:**
    ```bash
    /home/user/tailscale/tailscale up
    ```

## Project Structure

- `src/routes/alpine`: The SvelteKit route for the Alpine VM.
- `config_public_alpine.js`: CheerpX configuration for the Alpine VM.
- `starsector.zip`: Starsector Linux binaries (0.98a-RC8).
- `tailscale.tgz`: Tailscale Linux x86 static binaries.
- `setup.sh`: Script to automate extraction inside the VM.
- `build/`: The compiled production-ready site.