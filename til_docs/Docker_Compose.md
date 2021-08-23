### docker-compose Quick Tips

- run `docker-compose run <service> <command>` to run a service with a one-time command. E.g. `docker-compose run backend bash` to run `backend` interactively without actually starting Django
- Arguments in the `build` section of the .yml file are the only arguments applied at build time
- If you specify both image and a build in the .yml file `docker-compose` will tag the image as the image name when building in, but will pull from remote for that image name when using `pull`
- Can specify which DNS servers a container uses with the `dns` keyword (can specify this in `docker run` too)