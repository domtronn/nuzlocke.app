import Pokemon from 'pokemon-assets/assets/data/pokemon.json';
import { filterObj, mapObj } from '$lib/utils/arr';
import { pick } from 'ramda';

const FormMap = {
  //  alola
  rattataalola: 10091,
  raticatealola: 10092,
  raichualola: 10100,
  sandshrewalola: 10101,
  sandslashalola: 10102,
  vulpixalola: 10103,
  ninetalesalola: 10104,
  diglettalola: 10105,
  dugtrioalola: 10106,
  meowthalola: 10107,
  persianalola: 10108,
  geodudealola: 10109,
  graveleralola: 10110,
  golemalola: 10111,
  grimeralola: 10112,
  mukalola: 10113,
  exeggutoralola: 10114,
  marowakalola: 10115,

  // galar
  meowthgalar: 10161,
  ponytagalar: 10162,
  rapidashgalar: 10163,
  slowpokegalar: 10164,
  slowbrogalar: 10165,
  slowkinggalar: 10172,
  farfetchdgalar: 10166,
  weezinggalar: 10167,
  'mr-mimegalar': 10168,
  articunogalar: 10169,
  zapdosgalar: 10170,
  corsolagalar: 10173,
  zigzagoongalar: 10174,
  linoonegalar: 10175,
  darmanitangalarzen: 10178,
  darmanitangalarstandard: 10177,
  yamaskgalar: 10179,
  stunfiskgalar: 10180,

  // Hisui
  growlithehisui: 10229,
  arcaninehisui: 10230,
  voltorbhisui: 10231,
  electrodehisui: 10232,
  typhlosionhisui: 10233,
  qwilfishhisui: 10234,
  sneaselhisui: 10235,
  samurotthisui: 10236,
  lilliganthisui: 10237,
  zoruahisui: 10238,
  zoroarkhisui: 10239,
  braviaryhisui: 10240,
  sliggoohisui: 10241,
  goodrahisui: 10242,
  avalugghisui: 10243,
  decidueyehisui: 10244
};

const findEvoLine = (p) => {
  let res = p;
  while (res?.prevo) {
    res =
      res?.baseSpecies && res?.prevo
        ? Object.values(Pokemon).find(
            (p) => p.sprite === res.baseSpecies.toLowerCase()
          )
        : Object.values(Pokemon).find(
            (p) => p.sprite === res.prevo.toLowerCase()
          );
  }
  return res?.baseSpecies
    ? Object.values(Pokemon).find(
        (p) => p.sprite === res.baseSpecies.toLowerCase()
      )?.sprite
    : res?.sprite;
};

export const format = ({ name, forme }) => {
  if (forme === 'Galar') return `Galarian ${name.replace(/-Galar/g, '')}`;
  if (forme === 'Alola') return `Alolan ${name.replace(/-Alola/g, '')}`;
  return name;
};

export const sumObj = (o) => Object.values(o).reduce((acc, it) => acc + it, 0);

export default mapObj(
  filterObj(
    Pokemon,
    (pkmn) => !pkmn.forme || ['Galar', 'Alola'].includes(pkmn.forme)
  ),
  (pkmn) => ({
    ...pkmn,
    imgId: FormMap[pkmn.alias] || pkmn.num,
    total: sumObj(pkmn.baseStats),
    evoline: findEvoLine(pkmn),
    label: format(pkmn)
  })
);

const props = [
  'evos',
  'evoline',
  'types',
  'name',
  'sprite',
  'label',
  'alias',
  'imgId',
  'baseStats',
  'total',
  'num'
];

export const filterdata = (o) =>
  Object.values(o).map((p) => ({
    ...pick(props, p),
    evos: p.evos.map((e) => e.toLowerCase()),
    types: p.types.map((t) => t.toLowerCase())
  }));
