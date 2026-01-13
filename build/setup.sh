#!/bin/sh
echo "Setting up Starsector..."
unzip /web/starsector.zip -d /home/user/
echo "Setting up Tailscale..."
tar -xzf /web/tailscale.tgz -C /home/user/
# Move the extracted tailscale directory to a simpler name
mv /home/user/tailscale_* /home/user/tailscale
echo "Done! You can run Starsector from /home/user/starsector/starsector.sh"
