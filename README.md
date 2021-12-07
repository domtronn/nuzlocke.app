# Nuzlock tracker

This project is designed for tracking Nuzlocke runs, the Pokemon
you've encountered and their status. But it also provides information
and adivce for Bosses you face. 

### Contributing

Currently, I'm working through entering the data for all existing
games but this can easily be made to support mods or other game
formats.

If you want to contribute you will need to provide 2 files, the
`routes.txt` and `league.txt` which should be in the following format
below named after the generation, e.g. `oras.txt`

**League data**
```
--1|Gym Leader Name|Gym Leader Speciality|/image/path
pokemon|level|move1,move2,move3,move4|ability|held-item
pokemon|level|move1,move2,move3,move4|ability|held-item
pokemon|level|move1,move2,move3,move4|ability|held-item
```

**Route data**
```
Route 1
Route 2
--Gym battle|1|gym-leader
Route 3
```

**Patches**
Patches are needed by
[RomHacks](https://en.wikipedia.org/wiki/ROM_Hacking) as they often
make changes to abilities, moves, items, and stats.

To support a **RomHack** you will need to provide a patches file containing the following

```
--item
item name|item sprite|item description

--move
name|type*|power*|description 

--ability
name|description

--pokemon
hp,atk,def,spa,spd,spe*|name|type1,type2*
```

`*` denotes optional fields, you can leave these blank but you must
include the necessary number of `|`s, e.g. `cut||90` will just modify
the power of `cut`

Pokemon stats are a **comma** `,` separated list, but you should only
include the modifications, e.g. `,,100` will modify the defense to
`100`


### Alternatives

There are a lot of alternatives out there, and whilst they don't meet
the needs I personally was looking for, you should absolutely check
them out and thank their creators.

- [Nuzlock tracker](https://nuzlocke.netlify.app/) - An all in one nuzlocke manager (most similar) 
- [Nuzlocke tracker](https://ashenfactory.github.io/nuzlocke-tracker/) - A simple in order route tracker
- [Nuzlog](https://techyfatih.github.io/Nuzlog/) - A journal, team and item manager
- [Nuzlocke Generator](https://nuzlocke-generator.herokuapp.com/) - Image creator for runs 
