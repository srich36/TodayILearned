# Graphs

## Breadth First Search (BFS)

- Want to search all of your neighbors before searching any of your neighbors neighbors
- Thus, when encountering a neighbor you must add it to be searched later but not right away
- For this you use a queue and process nodes by the queue
- Will find shortest path (unweighted)

## Dijkstra's Algorithm

- Shortest (weighted) path between two nodes
- Uses dynamic programming to compute the shortest weight to any given node, updating this shortest weight as all nodes throughout the graph are processed (and neighbors updated if cost to get to current node + weight of edge to neighbor < dynamic programming computed shortest weight>)
- Goes through each node once at a time, going by the shortest node you can find
- The logic for this is that when you process only the shortest (a.k.a least weight) node, there is no possible way to get there in a shorter path, thus it will not be updated in the future, and thus it is safe to process now
- Following this logic is why Dijkstra's algorithm doesn't work for nodes with negative edges

## K Nearest Neighbors (KNN)

- Classification/Recommendations

## Bloom Filters

- Probabilistic data structure that is like a hash table but with way less memory

## Hashing 

- Goes from `string` -> `string`
- Can hash whole files to determine if the contents are the same (git status)
- e.g. SHA (Secure Hashing Algorithm) 256, md5
  - Can hash a file with `md5sum <filename>`

#### Locality Sensitive Hashes

- Normally hashes are location insensitive (a small change in input will cause a large change in output)
- `simhash` is location sensitive however
  - Useful for plagiarism checks, etc.