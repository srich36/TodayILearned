# General

- Files are mapped by the OS onto physical drives
- Files are just a convenient way to display/use the raw disk for the user
- Files are essentially the only way a user can store data on the disk
- File extensions just tell the OS what the format of a file is so it can maybe interpret (in Unix this often isn't 
used for anything)
  - `Unix` just interprets files as a sequence of 8 bit bytes, nothing else (execpt executable files, it understands 
  those)
- Executable files must be in a certain format so the OS knows how to load the file and find the first instruction (
e.g. `ELF` for Unix)
- symlink - pointer to another file
- hardlink - mirror of a file. When one end of the mirror is changed the other is as well
- a file is just a data structure - a sequence of logical records implemented by the OS
- *Active Directory* in Windows is just a single namespace for users across a distributed environment
  - All clients and servers then use this for authentication
  - *LDAP* (lightweight, directory access protocol) is this but used in Linux. *Active Directory* is also built on LDAP

## File Storage

- Typically a file entry consists of a file name and its unique identifier
  - This identifier leads to more information such as where the file is located on disk, etc.
- The OS presents the file as a series of blocks (e.g. 1024 bytes), and gives the *block number* in relative terms
to the application (e.g. block 1, block 2) even though this may be like block 10,000 and block 2,500 on the disk
  - This decouples the actual file storage from the application
- The file itself may have an *index*, a map of block number to pointers to the actual block
  - For large files, the index may have an index, etc.
- For hard links, Unix keeps track of the number of entries pointing to a given file in the inode, only deleting it 
when the reference number gets to
- **see inode infomration** with `stat <filename>`

## Operating on a File

- The OS must search its directory entries for the given file in order to perform operations on it. To prevent
the OS from having to do this every time, the system calls require a *file handle* returned from the `open` system
call. `Open` creates an indexed entry into an *open file table* for quick access, and returns this pointer as a file
handle
- To allow for multiple processes operating on a file at once there are two levels of open file tables:
  - 1. Per-process table -> This keeps current read/write pointer location, etc.
  - 2. System-wide open-file table -> This keeps shared information like location on disk, file open count, etc.
  - Files can also be opened with locks
- Unix treats all files as a stream of individually addressable bytes

## Directory Structure

- Directories are just files -> one bit in the file entry determines if it is a file or directory
- Directories can be sourt of thought of as a symbol table that maps file names to their file control block

## Permissions

- Unix r,w,x (3 bits, for a value from 0-7) - r=4, w=2, x=1)
- Owner, Group, Universe (o,g,u)

## Open File Tabs

- Per process: contains a copy of each open file's inode (pointers to global table)
  - The entry in this table contains other data like current file pointer (for next read or write)
  - When you call `open()` it returns a pointer to this entry in the per-process open file table. All file operations
  are then done on this entry
  - **The pointer to this entry is the file descriptor** (`fd`)
- Globally: contains copies of all open file's inodes

# File System Implementation

- There are different file system types
  - Temporary (tmpfs)
  - Secondary storage (ext4)
  - Distributed (mounted on different hosts) e.g. HDFS
- Transfer to discs currently happens in block sizes (cannot directly address memory, but this could be the future)
- In Linux, the basic file system issues generic commands to device drivers to read and write from disks (e.g. retrieve
block 23
- A layer above that, the *file organization module* keeps track of information about files and their blocks 
  - Each file has logical blocks numbered **0 through N**
  - This system also tracks unallocated blocks
- A layer above that is the logical file system, which organizes the file system structure and keeps track of metadata
  - It maintains this structure through *File Control Blocks* (FCB's)  or *inodes*
  - *inodes* contain information about the file - permissions, its location on disk, etc.
- A *boot block* is the first block of a volume and tells the system how to boot the OS on that volume (if there is one)
- A *volume control block* comes next, which describes the number of blocks in the volume, free space, etc.
- To create a file, the system allocates an inode, reads the corresponding directory entry into memory, and updates the 
directory entry with the new filename and inode info
- On Unix, inodes are pre-allocated on a volume
- Some systems use a *buffer cache* which caches file system blocks that are likely to be used again
- Most systems cache file data and process information in *page caches* (unified virtual memory)
- `Syncronous writes`
  - Ensure that data is written in the order it is sent to the device, writes are not buffered (e.g. used for database transactions)
- `Asynchronous writes` 
  - Data is written to the cache (eventually flushed to disk). Most writes are asynchronous
  - Disk flushes happen when convenient
  - The device driver may send these writes in an order that minimizes seek time for HDDs, for example
- A directory structure is just a tree that starts at the root and has pointers to files and their associated FCBs
   A directory entry is just a mapping from filename to inode number

## Free Space

- The system keeps track of a free space list
- Often implemented as a bitmap or bit vector where each block is one bit
  - This runs into issues when you can't keep it in main memory (modern systems)
  - Can also implement as a linked list
- When deleted, blocks typically keep their data and just don't have a file pointer to them anymore

## Recovery

- System crashes can leave inconsistencies in file-system data structures (directories, free-block pointers, free FCB pointers, etc.)
- A full scan of the metadata of each file system can check for inconsistencies but this takes a long time
- Instead, a *status bit* is set on the file system metadata when it is being updated and cleared when the update completes successfully
  - If this bit is set after a reboot something went wrong
- If the status bit is set after reboot you want to run a *consistency checker* (e.g. `fsck`)
  - This compares the data in the directory structure and any other metatdata with the actual state on storage and 
  reports any inconsistencies
- ZFS uses something like MVCC for transactions/recovery

# Log-Structured File Systems

- Like databases, called *log-based transasction-oriented* or *journaling* file systems (ext4 uses this)
  - This helps remove the need for the human in the loop to respond to possible irrecoverable `fsck` problems
- **All metadata changes written to a log in a transaction**
  - Once written to the log they are considered committed
  - Log entries are then replayed over file system structures
- The log is a circular buffer (a buffer that starts at the beginning when writing past the end)
  - Old log entries are overwritten (not data that has not been saved yet, however)
- After a system crash, any transactions (written to the log) that were not completed are replayed on to the file system
- This basically removes the need for `fsck` instead of file system structures
  - If you ever need to use `fsck`, you are `fscked` - Sean

## Backups

- Since you know the last backup date and can read file data for the last modified date you can do incremental backups

## Internals

- A computer can have multiple devices -> split into partitions -> split into volumes -> hold files
- The boot loader needs to know about the filesystem for it to boot the OS
  - The *root partition* is mounted at boot time (contains the kernel)

### Mounting

- Need device name and location within the main file system for the mounted file system to attach
- Whenever macOS detects a disk, it searches for a filesystem on that disk and if it exists, mounts it under `/Volumes`
- In Linux, specify mount points in `fstab` (filesyste table)
- Windows mounts each file system at a different letter (e.g. E:\\)
- In Unix, if a filesystem is mounted on a directory, the directory has a flag set saying that it is a mount point and 
has a field pointing to the corresponding entry in the mount table 
  - This then has a pointer to the superblock of the mounted filesystem (the metadata of the filesystem, UUID, 
filesystem type, no. blocks, no. free blocks, etc.)

## Virtual File Systems / Virtual File System Layer

- To allow things like NFS, etc. to work/be mounted all within an ext4 filesystem without directly supporting every 
type of fileystem, Unix implements virtual filesystes
- the filesystem interface (e.g. `read`, `write`, `open`, `close`, speaks to a virtual filesystem (VFS) implementation
that abstracts away differet fileystem details from the OS)
- VFS's maintain `vnodes` which are globally unique network-wide (inodes are only uniqe per filesystem)
- The VFS performs the actual fileystem operations requested by the filesystem interface (handles local requests, 
uses network protocol for NFS), etc.
- **All** filesystems can be thought of as virutal file systems (and got through the VFS pipeline), even the root
- Made up of 4 main object:
  - `inode`
  - `file object` (open files)
  - `superblock`
  - `dentry object` (directory entry)
  - Each object type must implement certain functionality
  - This makes up the `file_operations` struct
- **As long as a filesystem implementation implements the required filesystem operations, the VFS can just call those 
specific methods and be completely agnostic**
- **The VFS is the translation layer, it does not implement filesystem-specific code**

## Consistency Semantics

- Writes to a file by one user are immediately available to other users who have the file open

## NFS

- client-server filesystem (recall that with the file system interface and virtual file systems these files can 
be interacted with just like they are locally as long as internally the NFS protocol is implemented in the open, close
methods, etc.)
  - One machine may be both the client and the server
- First the remote directory is mounted
  - The client then connects to the mountd daemon on the server through an RPC. If permissions are allowed, the mountd 
  daemon will return a file handle for the mounted file system (file system identifier and inode number of mounted directory)
    - The client sends the server hostname and the directory to be mounted in the request
  - The server will maintain an *export list* of directories that can be mounted along with the macines that can mount them
- Whenever a client tries to access a file that is actual an NFS file, the VFS implementation makes an RPC to the server
with the file handle returned from the mount, and user and group id's for permission checking
  - Thus, user and group id's must be the same on the client and server
  - `nfsd` is the NFS daemon responding to requests on the server
  - https://tldp.org/LDP/nag/node140.html

### NFS Protocol

- The NFS protocol for file access is just a series of RPCs
- All requests take a file identifier and an offset in the file
- The protocol is **stateless** - there is no concept of open/closed files
    - Thus each request is *idempotent* - implemented by having a sequence number so the server knows whether or not 
    to process again (or if there are any requests missing)


