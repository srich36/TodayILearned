# Overview

- Regolith is a desktop environment for linux that ships with preconfigured i3 (X11) or sway (Wayland) as a tiling window manager
- It uses `rofication` for the notification daemon which does **not** pop up notifications 
  - It instead stores notifications in a notification center (`<mod>+n`) and shows you the number of notifications you have at the bottom of your status bar
  - This is why slack notification pop-ups don't work :(
  - `dunst` is a notification daemon where there **are** popups but installing dunst conflicts the 
- See the [spec](https://galago-project.org/specs/notification/0.9/index.html) for how a notification daemon works on linux
  - A confirming service takes the `org.freedesktop.Notifications` service on the "session bus" (is this dbus?) and implements a standard interface