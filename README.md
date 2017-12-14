# trainscheduler

This application takes user-entered information concerning trains and their schedules,
and stores the information in a database. The train's first departure time and its frequency
is used to calculate the next departure time, and the number of minutes until this next
departure time. The time calculations are done using the Moment.js library.