
[[IP_Addresses]]	]]

### Subnets

Subnets allow you to divide the 16 bits of `Host ID` even further into a `Subnet ID` and a smaller `Host ID`. For example, 8 of these 16 bits can then become a `Subnet ID` with the last 8 being the `Host ID`. This allows network administrators to divide up the IP address (`Network ID`) they are assigned into 254 subnets with a maximum of 254 subnets per host. In this case `140.2.1.12` would be broken up as follows: `140.2` for the `Network ID`, `1` for the `Subnet ID` and `12` for the `Host ID`.

### Subnet Masks

While in the previous examles the `Subnet ID` only occupied 8 bits and the `Host ID` occupied the last 8 bits, this is not always true. The `Subnet Mask` determines which bits correspond to the `Network ID` and `Subnet ID` and which bits corresond for the `Host ID`. It is represented as follows: for each bit NOT corresponding to a `Host ID` it is set to one. For each bit corresponding to the `Host ID` it is set to 0. In the above example, the `Subnet Mask` would be 24 1's followed by 8 0's. 

This case would be represented in dotted notation as `255.255.255.0` or in Hex as `0xffffff00`. Different breaks between `Subnet ID` and `Host ID` can be described by different subnet masks. Subnets and Subnet Masks allow IP routing tables to be much smaller as only one entry is needed for the router to each subnet instead of a list of all machines on the network. 