## Tips

- When inner joining a table you can think about the join in reverse if you want. E.g. Joining posts with authors will create a result set of all posts with authors appended to the rows. Joining authors with posts **will do the same thing** and create more rows in the result-set than in the authors table if authors have more than one post on average.