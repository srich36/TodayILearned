## SMTP

- SMTP works over TCP
- The MTA (message transfer agent) actually sends the mail over TCP
  - The system administrator sets up the MTA
- The user-agent is what the user interacts with, and this communicates with the MTA to send the mail
  - This is the gui (e.g. outlook) or cli (`mail`)
- Each host has a mailbox
  - **All SMTP is is a protocol from sending mail from one system to the mailbox on another host**
- DNS mx records indicate mail servers for a given host
  - e.g. can run `host google.com` and some mail servers will be listed
    - `host -a google.com` will print out preference values for each alternate mail server
    - Mx records with the lowest preference value are tried first
- If your server has a domain name of mydomain.com, each user will have a mailbox of user@mydomain.com
  - (all system users don't necessarily have a mailbox but can be added to)
  - The mailbox will be in the `/var/mail/<user>` directory
  - You need to install an MTA to send mail locally
    - Can see this by trying to run `mail --debug-level=2 <recipient>`
    - It will try to send mail from `<user>@hostname.com`

## Email Parts

1. Envelope (MAIL from, RCPT To, etc.)
2. Headers
   - Possible headers
     - Reply-To
     - X-Phone
     - X-Mailer
     - To
     - Subject
     - Message-Id
     - From
     - Date
     - Received
     - etc.
   - Headers starting with X are used-defined
   - The user-agent adds some headers, then the MTA adds some headers
3. Body

## Relay Agents

- Generally, local MTAs communicate with a relay MTA which then communicates with the internet
- Any nonlocal outgoing mail gets sent to the relay agent
  - The relay agent then passes it on to the destination
- SMTP is used for this connection between local MTA and nonlocal MTAs

## General Timeline/Outline

1. Client queues message through client user-agent
2. Message is passed to client MTA
3. Client MTA opens up TCP connection to the destination mail server (where the mail is going/mailboxes are hosted) and sends the mail
4. This goes into the user mailbox
5. The user then uses a user-agent to view the mail

## Multipurpose Internet Mail Extensions (MIME)

- SMTP supports extensions that are backwards compatible with the original protocol
- Originally, email body had to be NVT Ascii
- MIME defines an extension that **allows for structure in the email body**
  - It just adds new headers that tells the recipient the structure of the body
- MIME Headers (not all required)
  - Mime-Version
  - Content-Type (e.g. Text/Plain, Application/JSON)
    - The first part is the content-type (e.g. Text) and second the subtype (e.g. Plain)
    - The `multipart` MIME Content-Type supports a body with multiple content types split up throughout the message
  - Content-Transfer-Encoding
  - Content-ID
  - Content-Description
- You see these headers describing HTTP request bodies as well
- MIME allows for arbitrary binary data to be exchanged
- MIME has now become a generic way of describing the structure of a document, file, or assortment of bytes. Thus it is used in HTTP requests
  - Though they are sometimes referred to as _media types_ within the web
