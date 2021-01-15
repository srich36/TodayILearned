# Wifi Networks

- To connect to a wifi network you need a Network Interface card (NIC) and a wifi antenna (these are in phones, laptops, etc.)

### WPA (Wifi protected access)

- Version 1 was the original version, Version 2 is the more secure version. Version 2 is often referred to as WAP AES because it offers Advanced Encryption Standard (AES)
- Both versions a *pre-shared key* (a password, i.e. PSK) that the client and router know. This does *not* require and authentication server and is thus often called *WPA Personal*
- WPA Enterprise is often used by larger entities and **requires a radius authentication server**
  - Available with both WPA 1 and 2
  - Client/server model where the client sends an auth request to the radius server with a username and password
  - Provides greater security and protection against short password dictionary attacks
  - Various kinds of the Extensible Authentication Protocol (EAP) are used for authentication


### DHCP

- A DHCP server runs on the router (e.g. `dhcpd`), will receive requests from the client, and then dynamically assign an IP address to the requesting machine
- To manually get an IP address, you can run `dhclient`
- You can connect to a network through an interface *without* getting an IP address assigned. Networking utilities are just running `dhclient` in the background to get this dynamically


### Linux Commands

- Interfaces: `ip link`
  - Set interfaces up: `ip link set <interface> up` or `ifup <interface>` (interface)
- Routing table `ip route` or `route`
- `ifconfig` -> set interface parameters. `iwconfig` is this but only for wireless interfaces
- `/etc/network/interfaces` sets default parameters for all the network interfaces. Recall that packets get send to specific interfaces (each interface has its own MAC address and will get assigned its own IP address if connected to a router)
- `iwlist <interface> scan` to scan for wifi networks on a given interface (interface wireless scan)
- `wpa_supplicant` is a lower-level command that handles authentication with a router with `WPA` security (basically all routers)
  - e.g. `wpa_supplicant -c /etc/wpa_supplicant.conf -i <interface>` will attempt to connect to the networks defined in `/etc/wpa_supplicant.conf`
    - Can run `wpa_passphrase` to generate pieces of the config file
  - Things like the higher-level NetworkManager service and its cli `nmcli` will handle running `wpa_supplicant` under the hood, handle automatic connections, reconnecting when a connection drops, etc.
- `journalctl -u <service_name>` for logs


