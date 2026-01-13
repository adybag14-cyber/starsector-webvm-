// The root filesystem location
export const diskImageUrl = "wss://disks.webvm.io/alpine_20251007.ext2";
// The root filesystem backend type
export const diskImageType = "cloud";
// Print an introduction message about the technology
export const printIntro = false;
// Is a graphical display needed
export const needsDisplay = true;
// Memory limit in bytes (optional)
export const memory = 2048 * 1024 * 1024;
// Executable full path (Required)
export const cmd = "/bin/sh";
// Arguments, as an array (Required)
export const args = ["--login"];
// Optional extra parameters
export const opts = {
	// Environment variables
	env: ["HOME=/home/user", "TERM=xterm", "USER=root", "SHELL=/bin/sh", "LANG=en_US.UTF-8", "LC_ALL=C"],
	// Current working directory
	cwd: "/home/user",
	// User id
	uid: 0,
	// Group id
	gid: 0
};
