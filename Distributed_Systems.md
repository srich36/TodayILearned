# Networking Architecture

### Reverse Proxy

A `reverse proxy` is a proxy that sits in front of the backend/web server and receives incoming requests and then processes those requests routing them to the correct server. In this way you can configure something like `nginx` to be a load balancer as it receives incoming requests and load balances them to different server instances.

### Forward Proxy

For a `forward proxy` client requests immediately go through a proxy server which then routes those requests to the domain specified in the request. This domain then may point to a `reverse proxy` which routes the requests to different microservices in the application.

### Microservice Architecture

A collection of instances, db, cache, application server, that are isolated (mostly in Docker containers) and can communicate with each other on the network. If you have a microservice application server for example, you can load balance incoming requests (e.g. through an `nginx` configuration) to the different application server instances on the network. This allows you to `horizontally scale` your application as you can easily spin up new instances of whatever layer, application server, db, etc. that needs more computing power.

### Sidecar Paradigm (ngnix)

Sidecars are a way of structuring application architectures so that for individual microservices to talk to one another they have to go through a proxy (called a sidecar). This allows you to take all the ssl and policy management out of the application themselves, and instead have something like `nginx` working as a `reverse proxy` applying access policies between services. For more information see the Software Engineering Daily podcast on sidecars.

# Deployments

### Static Files

Static files are files that change very infrequently from request to request. As such, they can be cached upon retrieval since you know that they won't change on the next request (The browser and something like Cloudfront handle this for you). Thus, the best way to deploy static files is to put them in an s3 bucket (which auto-scales) and have something like Cloudfront in front of it which is a CDN. Cloudfront will cache the static files at its point of access in the network making for faster retrieval time and reducing load on the s3 bucket. If no cache of the files exist, it will go to the s3 bucket and retrieve it. To configure this, all you need to do is point Cloudfront to your s3 bucket, and point your domain name to Cloudfront.

### Load Balancer

At its core, a load balancer simply accepts incoming traffic and routes it to a number of different application instances. Since it is what is accepting and routing traffic, this acts as a **reverse proxy** and thus can take the role of what nginx does. These incoming requests can then be routed to application instances running with something like `gunicorn` for `Django`. Note that nginx can easily configured as a load balancer too, but if you use an elastic load balancer from AWS you do not need it. This is because when running `nginx` as a reverse proxy something else acts as the web server and serves the responses (e.g. a `Django` app). Were you using `nginx` to serve files like `index.html` and not as a reverse proxy, then you would need to route the load balancer to the `nginx` instance.

# Overall Flow for Decouple Frontend and Backend App

## Frontend

On push to master, build the frontend distribution files and sync them to an s3 bucket. Put cloudfront in front of the s3 bucket and route all traffic to cloudfront. Then direct any traffic to your domain name to your cloudfront instance. Point your cloudfront instance to your s3 bucket. When a request comes to cloudfront it will either return the cached static file version, or get it from the s3 bucket, cache it, then return that. This reduces load on the s3 bucket and can handle a very very high amount of traffic effectively because s3 scales and accepts requests automatically.

## Backend

### Database

Create a database instance using one of AWS's database services. It is never a good idea to try to manage your own database instance containerized or whatever as this can potentially lead to serious data loss issues. This database will have a set of credentials for connecting to it that can be passed in as environment variables to the application instances.

### Application servers

Create a load balancer with a rule/listener to route all traffic to a certain target group. This target group will be comprised of autos-scaled instances running a specified task definition. The task definition will likely be running a specified Dockerfile that is built and pushed to Amazon's ECR with CI/CD. In this task definition you will pass in the database connection environment variables. The target group - a target is an instance - handles the scaling up and down of all the instances and the load balancing of traffic between the auto-scaled instances.
