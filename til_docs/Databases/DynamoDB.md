# Terminology

- *Item Collection* - All the items in a single table that share the same partition key in either the primary key or a secondary index

# Overview

- All requests to DynamoDB are made over HTTP requests -- this is different than the traditional TCP connection model
    - This is done so the DB server doesn't need to maintain persistent connections
- AWS IAM is used for authz and authn of requests
- DynamoDB can scale read and write throughput independently 
- Old relational databases were built for a world where storage was the limiting factor. Nowadays compute is the limiting factor, and this 
is what DynamoDB is designed for
- The DynamoDB wide column key-value data model is **different** than the MongoDB document model
    - The document model provides significantly more flexibility in querying and altering access patterns and has more index types
    - These may hurt you as you scale
- DynamoDB tables often contain multiple types of entities (e.g. single table design)
- Different attribute types have different operations that can be performed on them in queries
    - Integers can be added or subtracted to, sets can check for existence
- DynamoDB streams is a built-in change data capture stream to DynamoDB that you can use to ETL changes or programatically react to
- DynamoDB items can have a `ttl` field which allows DynamoDB to delete items after the ttl expires 
    - The item will usually be deleted within 48 hours after expiry 
- When an item is written by primary key, the primary storage node for that item will write that data and commit it to a quorom of secondary nodes for that item
    - After this, it asynchronously replicates the write to the other secondary nodes
    - **This is why DynamoDB partition key lookups have two options for consistency**: eventually consistent (allow reads from secondary nodes) or strong consistency (read from the primary storage node)
    - By default DynamoDB opts for eventual consistency on these primary key reads 
- DynamoDB has a 400KB item size limit (much less than 16MB MongoDB or 2GB Cassandra)
- Each query can only read 1MB of data (before filters)
- Item Collections can have a max size of 10GB for LSIs
- DynamoDB restrictions make it so you can't write a bad query that breaks as your table scales
- **Item collections are stored as a B tree**
    - This is why you can do range queries or `begins_with` but not `contains` or `ends_with`
- `TransactWriteItems` can operate on up to 10 items at any given time
    - One `TransactWriteItems` request **can just be a `ConditionCheck`** which doesn't operate on an item, but just asserts a check

## Keys

- A primary key in DynamoDB must be unique in a table
    - This primary key is either just a partition key, or a partition key and a sort key
- The partition key is fed into a hash function to determine which node the data will be written to and stored on
- A simple primary key (just a partition key) allows you to fetch one item at a time
- A composite primary key allows you to fetch many items at a time based on the partition key, or one item with the full primary key

### Secondary Indexes

- Global secondary indexes (GSI)
    - Eventually consistent, data is replicated after writing to a new index with the primary key specified for the GSI
    - You don't need to "select" all attributes to be projected into the GSI, you can make it only a subset
- Local secondary indexes (LSI)
    - Use the same partition key as the primary key but a different primary key
    - You can opt for strongly consistent reads with an LSI
    - Must be defined at table creation time
- Unless you need strongly consistent reads you should probably go with a GSI

# Data Modeling Tips

- When you have a one-to-many relationship you should split items up into an item collection rather than storing them all on one row
- Overload your indexes and keys with different entity types for effecient queries 
    - Each entity should be prefixed with it's item type (e.g. ORG#<id>, USER#<id>)
    - This is true for both the primary key and secondary indexes
- If you have Customers and Orders, you design your table with both entity types in it and design your key/index structure where you can retrieve a customer and all their orders at once
- Fiiltering in dynamodb is built direcctly in your data model
- **The first thing you have to do is define your access patterns**
- Multiple entities 
    - Write out all your different entities and what the generic `PK` and `SK` will be for them
    - Almost all tables with multiple entities will need a composite primary key
    - *Use primary key prefixes to differentiate between entity types*
    - It's best to do as much as you can (as many access patterns as you need) with the primary key
        - If this doesn't work you can reach for GSIs
    - Adding a GSI for each read pattern is overkill -- you can overload your GSIs just like you do your PKs
        - This will also require generic column names 

# Single Table Design

**Overall thoughts:** Single table design is overcomplicated and inflexible. It is only needed at scale for maximum performance.
It is not a design pattern I would use. As access patterns change you may find yourself stuck, and this makes it much harder to ETL
your data to analytics systems.

- This data modeling tactic is about using as few tables as possible, and ideally only using one table for an entire application
- Single table designs are an alternative to relational database joins
    - With other DynamoDB designs, application developers will have to make separate queries and join in application code
- The solution is to pre-join all your data in an item collection
    - i.e. share the same partition key but have a different sort key
- **Not all of the sort keys have to represent the same time of data**
    - e.g. a users parition key can have a profile and orders sort keys
- **The main reason for using a single table in DynamoDB is to retrieve multiple, heterogenous item types using a single request.**
    - e.g. return user and order information
   - The main benefit here is a performance improvement
- Downsides
    - Inflexiblity in adding access patterns
    - It's difficult to ETL your data for analytics
- You need to really define your access patterns first 
- When should you **not** use single table design?
    - When you need flexibility and developer agility
    - When you need easy analytics on your data
    - When you don't care about blazing fast performance
    - Doesn't sound like we really need this at startups
- In DynamoDB you collapse the "rows" of various tables of relational databases into collections that represent the access patterns
- Partition key and sort key names are generic (e.g. `PK` and `SK`) since you store multiple entities in a given table
- In single table design you should consider not using an ODM (object document mapper) and just using the AWS API directly
    - This is because you are storing multiple different entity types on a given table
- Even if you encode a `username` attribute in your generic `PK` you should still have a separate `username` attribute on your item
    - Keeping it just on the PK adds complexity and risks data loss if you change indexing attributes in the future
- Don't reuse attributes across indexes - GSI1 and GSI2 shouldn't use the same generic `GSI1PK` attribute etc.
- Add a `Type` attribute to every item

## Data Modeling Strategies

### One-to-Many relationships

- e.g. a single customer may have multiple orders 
- The key question: how can I fetch information about the parent entity when retrieving one or more sub-entity?
- Denormalization by using a complex attribute
    - Have an attibute that uses a complex data type like list or a map
    - e.g. Have a customer object with a list of orders on it
        - Because this list can have multiple values it's not atomic and violates first normal form -- this is okay with NoSQL
    - If you have any access patterns based on elements within the complex attribute this won't work
    - If the amount of data can be unbounded and the item can exceed 400KB this won't work
- Denormalization by duplicating data
    - If you have a bunch of order rows, this would be storing customer information on each one
    - The key question to ask here is **if the duplicated data is immutable**
        - If not immutable this is a bad fit unless very few items are affected
- **Composite primary key with a Query**
    - This is the most common way to represent a one-to-many relationship
    - e.g. A `customerId`partition key and **an overloaded sort key**, containing both an entity for the customer information **and** and entity for the orders information
    - E.g. your sort key could be of the format `CUSTOMER#<customerId>` and `ORDER#<orderID>`
    - Thus, the item collection for a given `customerId` contains the customer information **and** all of their orders
    - **You also get additional access patterns from this design automatically**
        - Get a specific customer (partition key of `customerId` and sort key of `CUSTOMER#<customerId>`)
        - Get a specific order (partition key of `customerId` and sort key of `ORDER#<orderId>`)
        - Get only the orders for an customer (not the customer record itself) -- can use a `beginsWith` `ORDER` on the sort key which
        is still efficient since data is stored as a b tree
    - This is essentially pre-joining your data at write time so it can be easily queried at read time
- Secondary index with a query
    - You can add a `gsi` to query items vs. doing it with the main table indexes 
    - This is primarily used when the primary keys of your table are already used for a different purpose (e.g. ensure uniqueness on a particular property) or when there are multiple levels of hierarchy
    - Zendesk example: Organization has many users, each user can have multiple tickets 
        - If you tried to also use the sort key differentiator with a prefix of `USER#<userId>#TICKET<ticketId` (so you could get all tickets for a given user) this would crush the use case of retrieving all users for an organization, since a `beginsWith` `USER#` would now also grab the tickets 
        - Alterntiavely, we can model ticket items with a `PK` of `TICKET#<ticketId>` (allowing direct access of a ticket)
        - We'd then add a gsi on different `GSI1PK` and `GSI1SK` fields where `GSI1PK` would be `ORG#<orgId>USER#<userId>` and `GSI1SK` would be `TICKET#<ticketId>`
        - This gsi allows looking up all the tickets for a given user
        - If timestamp is in the `<ticketId> ` you can look up the most recent tickets via the GSI because `TICKET#` is < `USER#` and you can scan the index in reverse (this is so dumb)
- Composite sort keys with hierarchical data
    - What if you have more than two levels of hierarchy? E.g. tracking starbucks by location (state, city, zip, country)
    - The `PK` would be `Country` and `SK` would be address parts (getting more specific) delimted by `#`
        - e.g `<state>#<city>#<zip>`
    - This works best when 
        - You have many levels of hierarchy and have access patterns for different levels of the hierarchy
        - When searching at a sublevel you want all subitems as well as just the items in that level 

### Many-to-Many relationships

- e.g. a student may take multiple classes and a class may have multiple students 
- These are the most difficult to handle in DynamoDB
- Shallow Duplication
    - The class item collection stores a list of student identifiers (more detail on the students come from clicking on the profile in a UI for example)
    - The entire student record isn't needed on the class
    - This allows for Fetching a class and all the "shallow" student records 
    - How can you fetch all the classes a student is in? This pattern doesn't answer that question, it just turns the many-to-many relationship into something that can be solved by a one-to-many pattern
    - This works well for a limited number of immutable pieces of data
- Adjacency list
    - Model each top-level entity as an item in your table, **and** the relationship between them as an item
    - e.g. with movies and actors
        - 3 item types
        - `actor`, `movie`, `roles`
        - pk-sk for actors are `ACTOR#`, pk-sk for movies are `MOVIE#`, pk-sk for roles are `MOVIE#` `ACTOR#`
    - This allows you to fetch all actors in a given movie, a specific movie, or a specific actor
    - To fetch all the movies a given actor has been in we can add a GSI that flips the pk and sk
    - You can store mutable details on the `MOVIE` item itself, you don't need to store it on the `ROLE` item
        - The `ROLE` item is essentially a through table
    - This works well when the relationship between items is immutable 
- Materialized Graph
    - The pk represents some node id (e.g. a person) and sk is used to identify some entity about the node (e.g. job, life event, etc.)
    - A GSI is used to allow you to query by entity (e.g. job)
    - This allows you to have an item collection by node id, and item collections for each entity
    - This is a pretty niche pattern
- Normalization and multiple requests
    - If the information is highly mutable and duplicated across related items it may make sense to normalize your data
    - e.g. Twitter, displaying all the people that follow you
        - You need the profile name, profile photo, etc.
    - You don't want to store profile name, profile photo on the following relationship item node since it's highly mutable
    - The best way to do this is to store two entity types: user and following relationships
    - One call can be used to get all the following relationships 
    - You can then use the key in the following relationship in a `BatchGetItem` request to get details about all the people
    following (including display name, profile photo, etc.)

## Filtering

- If you are always going to filter on two or more attributes you can use a composite sort key
- Sparse indexes - DynamoDB only copies items into an index if the item has the index's primary key attributes
    - This can be really useful when used intentionally for data modeling
    - Providing a global filter on an item type (in an overloaded index)
        - e.g. if you want to filter for all user's that are admins, it would be wasteful to read through all the user items
        - Instead, you can add a special "ADMIN" attrbiute to users that are admins and use this as the GSISK1 in an overloaded index
            - This gives you an additional item collection of all users that are admins in a given org
    - Using sparse indexes to project a certain type of entity 
        - If you have multiple entity types and only want to have a way to filter for a particular entity type, you can create a sparse index that only populates for items of that entity type
            - It seems like this would be so much better to do in a data warehouse (who needs to query all items of an entity type in DynamoDB - something is wrong there)
- Adding filter expressions directly in your queries can preven you from knowing how many items you will return with a `limit`
    - Because of this, it's even more important you build your filtering right into your indexes so you can set a proper `limit`

## Sorting

- When considering your access patterns you must take sorting into account
- You need to arrange your items with your primary keys so they are sorted in advance
    - Your sort key will drive sorting here
- Casing matters in text sorting -- use lowercase if you need to maintain proper sorting
- Using unique sortable ids can help as well (KSUID, UUIDv7)
- **You cannot update a sort-key after it is created without deleting and recreating the item**
    - You can do this for a secondary index (what you'll want to use for an `updated_at` for example) because DynamoDB handles the deletion
    and recreation when replicating asynchronously
- 

## DynamoDB API

- Attribute names and values
    - Placeholders start with either `#` or `:`
        - `:` are placeholders for attribute values
        - `#` are placeholders for attribute names 
    - Why can't you provide the values directly? Because DynamoDB can't infer the type (e.g. something could be a string or an int)
        - Splitting this out into a separate property in the API makes it easier to parse and reason about
    - Why can't you proide the names directly? 
        - Unlike `ExpressionAttributeValues` you can just include the names directly
        - Placeholders are useful because the attribute names can include restricted characters or words
            - There are 500+ reserved words so it's better to just use `ExpressionAttributeNames`
- You can pass parameters to specify DynamoDB returns collection metrics 

## Expressions

- Key condition expressions, filter expressions, projection expressions, condition expression, update expressions
    - Key condition - describe what items to operate on
        - Can use the `BETWEEN` operator, `<=`, etc.
        - Can only be used on primary key attributes
    - Filter expressions - Determine which items to return **after** the items have been retrieved by the key condition expressions
        - Can be used on **any** attribute, not just primary key attributes
        - It's important to note that filter expressions run after the items are read from the table -- DynamoDB must do this since 
        there's no way to evaluate filter expressions before reading since the attributes are not primary key attributes 
        - The query operation will return max 1MB of data, but this is computed **before** the filter expression is applied
        - Your access patterns should be built into your primary key and indexes, not filter expressions
        - Filter expressions are purely used to reduce payload size and remove the need for application level filtering. Still useful,
        but not a silver bullet for access patterns
    - Project expressions - Determine which attributes to select
    - Condition expressions - Used in write operations to assert existing conditions about an item before writing
        - These can operate on any attribute in an item because condition expressions operate on **item-based actions** where the primary key of an item is already identified 
        - These are really useful for assuring an item doesn't exist in a table before writing
        - These work by first loading the item in the DB by the primary key passed into the write request, and **then** evaluating the conditions against it
        - Other use cases: preventing an account balance from going below 0, asserting the user is an owner of an item before deleting it, limiting the number of in progress items, etc. 
    - Update expressions - Describes desired updates to an item
        - **These are atomic**
        - These actually manipulate the item rather than writing an item
        - You can `SET`, `REMOVE`, `UPDATE`, or `DELETE` operations
        - You can operate on nested map elements with a `.` property