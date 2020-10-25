# DNS Records

- A `CNAME` record is an alias that points from one domain name alias to the actual domain name. On namecheap this can be done by mapping the `www` subdomain to the actual domain name for example.
  - e.g. a cname of www.mysite.com would point to mysite.com
- An `A` record maps the canonical (actual) domain name to the IP address hosting the website

Recall, when you purchase a domain you purchase a top level domain (TLD) which is `<domain>.<TLD>` (e.g. `example.com`). `www` is a subdomain so you must map that alias to the actual canonical domain name, which in this case is `example.com`.

# DNS

- DNS is an inverted tree, with the root servers being the parents and each child representing the authoritative name servers for a subdomain.
  - e.g. sean.test.com. will be a tree of `. -> com -> test`. The `.` is the root, and each domain name must end in a `.` to be a FQDN (Fully-Qualified Domain Name)
- Recursive nameservers don't know anything about actual DNS records, but recursively query the authoritative name servers, cache the result, and return it to the user. E.g. Google's `8.8.8.8` is a recursive name server
- Use `dig` (domain information groper) to query DNS servers
  - `dig +trace` gives you all the recursive query results
- By default, Linux systems will look for a name server running on port 53 (for Ubuntu this is a systemd stub) and which contains info for actual nameservers.
  - See `/etc/resolv.conf`
- Root servers are not used to recursively query (only to retrieve info of other authoritative nameservers). These other authoritative nameservers can then recursively query.

## Example

- Query test.com to `8.8.8.8`
  - 1. `8.8.8.8` looks if test.com is in cache -> if so return result
  - 2. If not in cache, query hardcoded root server for authoritative name server for the `.com` subdomain
  - 3. Ask the `.com` nameservers for the IP address of `test.com`
  - 4. Ask the `test.com` nameserver for the IP address
- Credit to [Julia evans](https://jvns.ca/blog/how-updating-dns-works/)
- 

## Pointer Queries

- Convert IP addresses to hostnames
- Must be configured in a mapping like hostname to IP address