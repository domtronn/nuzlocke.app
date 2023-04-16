import { calculate, Generations, Pokemon, Move } from '@smogon/calc';
import calcTypeAdvice from './_type-advice';
import calcRecommendations from './_recommended-advice.js'

import { pivotWeaknesses as weaknesses, typeAdvantages } from './_types';
import { movesToTypes, movesToCategory } from './_common';

import { capitalise } from '$lib/utils/string';

const intersection = (a, b) => {
  const s = new Set(b);
  return [...new Set(a)].filter(x => s.has(x));
};

const nonnull = (o) =>
  Object.fromEntries(Object.entries(o).filter(([, v]) => !!v));
const gen = Generations.get(8);

export async function POST({ request }) {
  const body = await request.json()
  const { box, team } = body;

  const teamMoves = team.map(({ name, moves }) => ({
    name,
    types: movesToTypes(moves)
  }));

  const typeAdvice = calcTypeAdvice(box, teamMoves);

  const dmgAdvice = Object.fromEntries(
    box.map(({ name: defName, sprite: defId, nature }) => {
      const maxLevel = Math.max(...team.map((t) => +t.level));

      const pkmnLevel = maxLevel < 5 ? 50 : maxLevel;
      const enemyLevel = maxLevel < 5 ? 50 + maxLevel : maxLevel;

      return [
        defId,
        Object.fromEntries(
          team.map(({ name: atkName, moves, item, ability }, i) => {
            return [
              `${atkName}-${i}`,
              moves.map((m) => {
                if (!m.power || m.damage_clas === 'status') return m;
                try {
                  const res = calculate(
                    gen,
                    new Pokemon(
                      gen,
                      atkName,
                      nonnull({
                        level: +enemyLevel,
                        item,
                        ability: ability.name
                      })
                    ),
                    new Pokemon(
                      gen,
                      defName,
                      nonnull({
                        level: +pkmnLevel,
                        nature: capitalise(nature || 'bashful')
                      })
                    ),
                    new Move(gen, m.name)
                  );

                  return {
                    ...m,
                    kochance: res.kochance().text,
                    desc: res.moveDesc(),
                    range: res.range()
                  };
                } catch (e) {
                  return m;
                }
              })
            ];
          })
        )
      ];
    })
  );

  const moveRatio = (type, l) =>
    Math.round((l.filter((i) => i === type).length / l.length) * 100);
  const moveAdvice = team.map(({ name, moves }) => {
    const categories = movesToCategory(moves).filter((i) => i !== 'status');
    return [
      name,
      {
        physical: moveRatio('physical', categories),
        special: moveRatio('special', categories)
      }
    ];
  });

  const teamMoveCategories = movesToCategory(team.map(({ moves }) => moves).flat()).filter(i => i !== 'status')

  const weaknessAdvice = team.map(({ name, types }) => [
    name,
    weaknesses(...types)
  ]);

  const summaryWeakness = Object
      .values(weaknessAdvice.map(i => i[1]))
      .reduce((acc, { 4: w4 = [], 2: w2 = []}) => ({
        weakness4x: intersection(acc.weakness4x, w4),
        weakness: intersection(acc.weakness, w4.concat(w2))
      }), {
        weakness4x: Object.keys(typeAdvantages),
        weakness: Object.keys(typeAdvantages),
      })

  const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b) / arr.length : 1
  const pct = (arr) => arr.reduce((acc, it) => acc + (it < 1 ? 1 : 0), 0) / arr.length
  const summaryMons = typeAdvice
        .map(([mon, teamMons]) => [mon, avg(Object.values(teamMons)), pct(Object.values(teamMons))])

  const recommendedMonsFromType = box
    .filter(p => p.types.some(t => summaryWeakness.weakness.includes(t)))
  
  const payload = {
    calc: dmgAdvice,
    dmg: Object.fromEntries(typeAdvice),
    weakness: Object.fromEntries(weaknessAdvice),
    moves: Object.fromEntries(moveAdvice),
    summary: calcRecommendations(box, team)
  };
  
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers: {
      'Content-Type': 'application/json'
    }
  });
}
