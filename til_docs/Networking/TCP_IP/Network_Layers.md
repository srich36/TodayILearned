# Layers

There are four main layers working for these protocols. In order of decreasing abstraction:

- application
- Transport (TCP/UDP)
- Network (IP)
- Link (Device Drivers)

The application is typically a user process while the other three layers are typically kernel functions. 

**As data is passed down throughout the layers, each layer adds information to the data by prepending headers or adding trailing information until the packet gets to the link layer and is sent**

