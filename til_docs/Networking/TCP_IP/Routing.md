# Establishing Packet Routes

Historically a portion of the IP datagram can be used to record the routers a packet hits along the way in the IP headers. However, IP headers are a fixed size, and thus you can only record up to 9 IPv4 addresses in a single packet. As the internet grew, this quickly became too few to record all of the hops. Thus, `traceroute` was written to find all the hops a packet takes between destinations.

Additionally, each IP datagram has a `TTL` (Time to life) field that is used to prevent packets from getting into routing loops. Traditionally this starts at 64 and is decremented at every hop. When `TTL` gets to 1, if the router cannot forward the packet to its finally destination it discards the packet and sends a timeout error with its IP address to the original packet source address.

# Traceroute

`traceroute` takes advantage of this `TTL` expiration by creating packets with incrementing `TTL's`, starting at 1. Therefore, each successive packet reaches one further hop and gets the router IP address at which the `TTL` expired. So by creating and sending packets with `TTL's` of 1,2,3...,n where n is the unknown number of hops to get to the end destination (you know it reached the end destination because the destination system will send back a port unreachable error because `traceroute` picks a destination port of 30000+ which the destination system is very unlikely to have a program running on), you can map the entire route a packet takes.

# Routing

- Routing tables define where packets should be sent based on destination addresses. For most internet packets they go through a default entry which is a router connected to the internet. The packet then goes through multiple hops in this same fashion, until the last router has a matching entry for the destination address
- Hosts build up routing knowledge through ICMP redirects being returned to them (and then adding the corresponding routes as shown by netstat). The rest of the routing knowledge is contained in routers