# Procedurally Generated Map in JavaScript

## Goal
While playing Stardew Valley and mining in the generated maps of the skull cavern, and in other games, I wondered how they dynamically generated maps and what process is like. 
This is an experimentation in JavaScript using the Canvas HTML5 object and some rules, Work in progress

try it out [here](http://firoved.com/github/pgm/)

## Definitions
* Maps are consisted of connected rooms
* Rooms are sizeable spaces in maps
* Cooridors connect rooms

## Rules
* Each room and cooridor must be pathable
* Maps should have 1 to 5 rooms
* Rooms should be at least 6 x 6 tiles in size
* Rooms should not be larger then 50% of map size
* Rooms should have a size ratio not greater than 1 to 5
* Cooridors should be paths from room centers

## Sources
Lots of good sources by googling, one very helpful one is [this](https://gamedevelopment.tutsplus.com/tutorials/create-a-procedurally-generated-dungeon-cave-system--gamedev-10099)


## TODO
* Make cooridors not too close to room walls
* Make rooms not too close to border of canvas
* Make cooridors have texture as well
* Deal with duplicate and crossing cooridors
