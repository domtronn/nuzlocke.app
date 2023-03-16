import Pokemon from './_pokemon.json';
import { pick } from 'ramda';

export const format = ({ name, alias }) => {
  if (alias.endsWith('-galar')) return `Galarian ${name}`;
  if (alias.endsWith('-alola')) return `Alolan ${name}`;
  if (alias.endsWith('-hisui')) return `Hisuian ${name}`;
  if (alias.endsWith('-paldea')) return `Paldean ${name}`;
  return name;
};

export const sumObj = (o) => Object.values(o).reduce((acc, it) => acc + it, 0);

export default Pokemon.map(
  (pkmn) => ({
    ...pkmn,
    imgId: pkmn.imgId,
    label: format(pkmn)
  }))

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
