- `/etc/services`
	- This file lists all well-known port numbers for applications (e.g. ssh on port 22, etc.)

- Network `bridge`
	- A `bridge` is a connection between two network interfaces in the link layer. Thus the two interfaces will appear as one to the network layer. Docker uses this
	- e.g. if one computer is connected to a router, then that same computer has an ethernet cable connected to another computer, you can create a bridge network which will place the second computer on the same network as the first computer and the router
  	- Bridge networks start with `br-` and can be seen when running `ip link`