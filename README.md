# Nuzlock tracker

<a href="https://www.buymeacoffee.com/nuzlocketracker" target="_blank">
<img
    src="https://www.buymeacoffee.com/assets/img/custom_images/yellow_img.png" 
    alt="Buy Me A Coffee" 
    style="height: 41px !important;width: 174px !important;box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;-webkit-box-shadow: 0px 3px 2px 0px rgba(190, 190, 190, 0.5) !important;" 
/>
</a>

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

You can find extensive examples of these in the [Nuzlocke.data](https://github.com/domtronn/nuzlocke.data) project.


### Alternatives

There are a lot of alternatives out there, and whilst they don't meet
the needs I personally was looking for, you should absolutely check
them out and thank their creators.

- [Nuzlock tracker](https://nuzlocke.netlify.app/) - An all in one nuzlocke manager (most similar) 
- [Nuzlocke tracker](https://ashenfactory.github.io/nuzlocke-tracker/) - A simple in order route tracker
- [Nuzlog](https://techyfatih.github.io/Nuzlog/) - A journal, team and item manager
- [Nuzlocke Generator](https://nuzlocke-generator.herokuapp.com/) - Image creator for runs 

### Useful links

- [Sentry](https://sentry.io/organizations/nuzlocke-tracker/issues/?project=6109144) - Sentry error tracking
- [Analytics](https://nuzlocke-analytics.vercel.app/) - Page views and click trackingc
- [Updates & Support](https://www.buymeacoffee.com/dashboard) - Follow feature updates and support me
- [PixelIt](https://giventofly.github.io/pixelit/#tryit) - A Pixelator for making custom assets
- [Usprited](https://github.com/linuxenko/usprited) - A sprite sheet editor & CSS generator

<!-- https://www.fiverr.com/kohari_nk/make-pixel-16x16-icon?context_referrer=search_gigs&source=top-bar&ref_ctx_id=cf16eab512166c55524582f57bd11493&pckg_id=1&pos=4&context_type=auto&funnel=cf16eab512166c55524582f57bd11493&imp_id=0d9b6187-ef6d-4936-b92e-b8ca99a75986 -->
