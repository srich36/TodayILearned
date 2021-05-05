# Timestamps

- A timestamp is just a representation on a clock
  - e.g. 2021-01-20 11:01:45 is just a timestamp. There is no information about a timezone encoded in this. Therefore, this timestamp can be the time in *any* timestamp, thus you cannot be sure of the exact UTC time
- Timestamps are represented by the `datetime` object in Python
- Timestamps with a timezone represent an exact moment in time that you can thus compare across timezones
  - e.g. 2021-01-20 11:01:45 PST means that the time is 2021-01-20 11:01:45 **only** in Pacific Standard Time, and thus you can convert this to a UTC time
  - Timezones are represented by the `tzinfo` attribute of datetimes
- Adding a `%Z` in a date format will output the timezone


## UTC (Universal Coordinated Time)

- Primary method the world coordinates times
- Timezones are measured in **offsets to UTC**
  - e.g. PST is UTC-08:00, meaning if you take the UTC time and subtract 8 hours you will get the pacific time (7 hours when in daylight savings)
- In databases, you should store timestamps in UTC
- If you know UTC time, you can then translate to other timezones through the offsets


## Python Datetimes

- *Naive datetimes* are datetimes without a tzinfo object (timezone info)
  - They are called *naive* because while they hold a year, month, day, hour, minute, etc. they don't hold any timezone information and thus cannot be correlated to one point in time
    - For example, the same datetime object (same year, month, day, hour, minute, etc.) can be times on the west and east coast respectively. With no timezone information, there is no way to differentiate these two times even though they are actually three hours apart. Because of this, you cannot convert to a single utc time from a timestamp with no timezone - you have no idea the UTC offset the timestamp originated from

## Postgresql

- `timestamptz` is the timestamp *with* timezone datatype
  - All timestamps for this data type are stored in UTC time
  - When inserting data into this column, Postgres automatically converts the inserted timestamp to UTC time (it assumes the input is in the same timezone as specified in the connection to the database server)
  - When querying this data type, the timestamps are automatically converted to the timezone set by the connection to the database server (**see this by running `show timezone`**)
- Can specify the timezone specifically by using `at time zone`
  - e.g. `SELECT '2021-01-20 AS TIME ZONE 'UTC'
- **timezone is a session parameter** -> This means it is set per connection. Every time a connection is exited it is reset to the default value defined in `postgresql.conf`. If no default is specified, it probably uses UTC
- You can set the timezone in postgres with `Set timezone='<timezone>'`

## Django

- When `USE_TZ` = True, Django sets the postgres timezone for every connection to `UTC`. Thus, Postgres will assume any timestamp inputs to the database are in UTC, and will not convert them on input, and not convert them on ouput
  - **When inserting data through Django you should thus pass in UTC timestamps**
- When `USE_TZ` = False, Django sets the postgres timezone to the value of the `TIMEZONE` setting, leading to the Postgres input/output conversion of timestamps
- Dbeaver/psql will set the timezone to local time in the connection, however. Thus, queries with timestamps between DBeaver and Django may not be the exact same (timestamps are interpreted as UTC in the Django<->Postgres connection and local time in the Dbeaver<->Postgres connection)
- Can view Django <-> Postgres connection timezone with `connection.connection.get_parameter_status('TimeZone')`

### Moment

- `moment.format()` will convert the timestamp from UTC into the locale time of the JavaScript runtime