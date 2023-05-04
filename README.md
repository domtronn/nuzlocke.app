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


<!--
Script for testing on webpagetest

window.localStorage.setItem('nuzlocke', '1')
window.localStorage.setItem('nuzlocke.1','{"__team":["Cerulean City","Route 20","Route 3","Mt. Ember"],"Starter":{"id":0,"pokemon":"cyndaquil","location":"Starter"},"Pallet Town":{"id":1,"pokemon":"clamperl","location":"Pallet Town"},"Route 1":{"id":3,"pokemon":"zigzagoon-galar","location":"Route 1"},"Viridian City":{"id":5,"pokemon":"spearow","location":"Viridian City"},"Route 22":{"id":6,"pokemon":"paras","location":"Route 22"},"Route 2":{"id":7,"pokemon":"zigzagoon","location":"Route 2"},"Viridian Forest":{"id":8,"pokemon":"surskit","location":"Viridian Forest"},"Pewter City":{"id":12,"pokemon":"espurr","location":"Pewter City"},"Route 3":{"id":13,"pokemon":"meowth-alola","location":"Route 3"},"Route 4":{"id":14,"pokemon":"magikarp","location":"Route 4"},"Mt. Moon":{"id":15,"pokemon":"zubat","location":"Mt. Moon"},"Route 24":{"id":17,"pokemon":"slakoth","location":"Route 24"},"Route 25":{"id":19,"pokemon":"mantyke","location":"Route 25"},"Cerulean City":{"id":21,"pokemon":"luvdisc","location":"Cerulean City"},"Route 5":{"id":23,"pokemon":"growlithe","location":"Route 5"},"Route 6":{"id":24,"pokemon":"qwilfish","location":"Route 6"},"Vermillion City":{"id":25,"pokemon":"farfetchd-galar","location":"Vermillion City"},"Digletts Cave":{"id":27,"pokemon":"diglett-alola","location":"Digletts Cave"},"S.S. Anne":{"id":28,"pokemon":"wimpod","location":"S.S. Anne"},"Route 11":{"id":30,"pokemon":"golett","location":"Route 11"},"Route 9":{"id":32,"pokemon":"shelmet","location":"Route 9"},"Rock Tunnel":{"id":33,"pokemon":"stunfisk-galar","location":"Rock Tunnel"},"Route 10":{"id":34,"pokemon":"tynamo","location":"Route 10"},"Pokémon Tower":{"id":36,"pokemon":"runerigus","location":"Pokémon Tower"},"Route 12":{"id":37,"pokemon":"dewgong","location":"Route 12"},"Route 8":{"id":38,"pokemon":"girafarig","location":"Route 8"},"Route 7":{"id":39,"pokemon":"inkay","location":"Route 7"},"Celadon City":{"id":40,"pokemon":"honedge","location":"Celadon City"},"Saffron City":{"id":43,"pokemon":"mudkip","location":"Saffron City"},"Route 16":{"id":49,"pokemon":"durant","location":"Route 16"},"Route 17":{"id":50,"pokemon":"muk-alola","location":"Route 17"},"Route 18":{"id":51,"pokemon":"altaria","location":"Route 18"},"Fuschia City":{"id":52,"pokemon":"poliwag","location":"Fuschia City"},"Safari Zone":{"id":55,"pokemon":"klefki","location":"Safari Zone"},"Route 15":{"id":56,"pokemon":"tsareena","location":"Route 15"},"Route 14":{"id":57,"pokemon":"charjabug","location":"Route 14"},"Route 13":{"id":58,"pokemon":"mantine","location":"Route 13"},"Power Plant":{"id":59,"pokemon":"manectric","location":"Power Plant"},"Route 19":{"id":60,"pokemon":"shellder","location":"Route 19"},"Route 20":{"id":61,"pokemon":"wailord","location":"Route 20"},"Seafoam Islands":{"id":62,"pokemon":"vanilluxe","location":"Seafoam Islands"},"Cinnabar Island":{"id":66,"pokemon":"dhelmise","location":"Cinnabar Island"},"Pokémon Mansion":{"id":71,"pokemon":"liepard","location":"Pokémon Mansion"},"Route 21":{"id":73,"pokemon":"qwilfish","location":"Route 21"},"Route 23":{"id":76,"pokemon":"fearow","location":"Route 23"},"Victory Road":{"id":77,"pokemon":"medicham","location":"Victory Road"},"Three Island":{"id":88,"pokemon":"smeargle","location":"Three Island"},"Mt. Ember":{"id":89,"pokemon":"coalossal","location":"Mt. Ember"},"Treasure Beach":{"id":90,"pokemon":"meltan","location":"Treasure Beach"},"Berry Forest":{"id":91,"pokemon":"durant","location":"Berry Forest"},"Bond Bridge":{"id":92,"pokemon":"hawlucha","location":"Bond Bridge"},"Cape Brink":{"id":93,"pokemon":"feebas","location":"Cape Brink"},"Kindle Road":{"id":94,"pokemon":"eelektross","location":"Kindle Road"},"Cerulean Cave":{"id":99,"pokemon":"machamp","location":"Cerulean Cave"}}')
window.localStorage.setItem('nuzlocke.consent', 'true')
window.localStorage.setItem('nuzlocke.saves', '1|1683021373039>1683185762250|Web Page Test Data|radred|01110100|1')
window.localStorage.setItem('nuzlocke.theme', 'dark')
-->
