# AMQP 0-9-1 

- The *Advanced Message Queue Protocol* is a protocol used for many message queues, such as RabbitMQ, AmazonMQ, etc.
  - Kafka does not use AMQP

# Message Lifecycle Overview

- *Brokers* receive messages from *publishers* and route them to consumers
- Messages are published to *exchanges* which are kind of like post offices
    - These exchanges have logic for routing the messages to queues 
- Consumers then *acknowledge* a message is received and it is then removed from the queue

## Exchanges

- Take a message and route it into zero or more queues
- Queue Types: 
    - Direct
    - Fanout
    - Topic
    - Headers
- The *default exchange* is a direct queue with no name (empty string) with all queues bound to it with a *routing key* (string) of the queue name
    - This allows you to essentially publish a message directly to queues using the queue name and the default queue

#### 1. Direct Exchanges

- These exchanges delivery messages to queues based on a routing key
- If the routing key matches the routing key specified by a queue as it binds to the exchange, the message is delivered
- A queue binds to a direct exchange with a given routing key

#### 2. Fanout Exchanges

- A *fanout* exchange ignores any routing keys and routes messages to all queues bound to an exchange
- This is "broadcast routing"
- Best for when many clients need to subscribe to a message

#### 3. Topic Exchanges

- These route messages to queues based on a routing key and a given bind pattern
- This is used for when there are many consumers who selectively subscribe to messages
- Can use wildcards to subscribe to messages here in the *bind rules*
    - You can have a list of words in the routing key delimited by a `.`

#### 4. Headers Exchange

- A *headers* exhchange is designed for routing messages to queues based on multiple attributes that you cannot express
in a routing key directly
    - e.g. you can use a `dictionary` as a matcher
- A message is "matched" to a queue if the value in the header matches the value specified upon binding the queue to the 
exchange
- These are "direct exchanges on steroids"


## Queues

- Queues store messages that are consumed by applications
- A queue is declared and/or created by application code -> it is idempotent
- Has a specific name
- Can be durable or transient
    - Durable queue messages are written to disk on message received
    - Transient queue messages are only flushed to disk periodically
- **For durable messages the message publishing to the broker must be durable, as well as the queue**


## Bindings

- *Bindings* are rules that exchanges use to route messages to queues
- Bindings bind a queue to an exchange 
- You can have multiple bindings to a single queue


## Consumers

- These *consume* messages from queues
- There are 2 delivery options:
    - 1. Push API -> Subscribers have messsages delivered to them
    - 2. Pull API -> Subscribers pull periodically (highly inefficient)
- When using the push API, applications specify interest in receiving messages from the queue through bindings

## Message Acknowledgements

- There are 2 modes for acknowledging messages from a queue (and thus causing message removal from the queue):
    - 1. After a broker sends a message to an application
    - 2. After an application sends back an acknowledgement
- You can specify the number of messages each consumer gets sent without the broker receiving an acknowledging (to be used for load balancing)

## Message Attributes

- Messages have attributes like `Content Type`, `Content Encoding`, a *routing key*, priority, timestamp, expiration date, 
etc.
- Some of these attributes are optional and are known as *headers* (like x-headers in http)
- Messages also have a data payload that is treated as a byte array
    - It's common to use JSON or serialization formats like *Protocol Buffers* or *Thrift* for serializing the message payload
        - The `Content-Type` and `Content-Encoding` headers are then, by convention, used to identify this
- If messages are not published as *persisted*, they will be lost if a broker restarts 
- If an application crashed the AMQP broker notices the connection is closed

## AMQP Methods

- These are HTTP methods (requests and responses sent to and from brokers)

## Connections

- Connections from applications to brokers are usually long-lived, use `TCP`, use authentication, and can go over
HTTPS


## Channels

- Some applications need multiple connections to a broker but it is inefficient to use multiple TCP connections
- Thus, channels are a way for multiple "connections" to share a single TCP connection
- Each client method occurs on a given channel
- Each method carries an integer channel ID  that both the broker and the client use to figure out which channel a method
is for

## Virtual Hosts

- You can have multiple independent isolated message queue environments on the same system, similar to how *server blocks*
work in nginx. These are *virtual hosts*

## Notes

- You should declare queues/exchanges in both producers and consumers since you can't be sure which application runs first
and the operation is idempotent

