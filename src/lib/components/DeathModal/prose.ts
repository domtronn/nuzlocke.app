import { capitalise } from '$utils/string'

export enum Tokens {
    TPoke = '<TRAINER POKEMON>',
    TType = '<TRAINER POKEMON TYPE>',

    OName = '<OPPONENT NAME>',
    OType = '<OPPONENT POKEMON TYPE>',
    OPoke = '<OPPONENT POKEMON>',
    OAtk = '<OPPONENT ATTACK>'
}

export enum ELossType {
    Random = 'random',
    Sacrifice = 'sacrifice',
    Mistake = 'mistake',
    OffGuard = 'offguard',
    Luck = 'luck',
    Dramatic = 'drama',
}

const Templates = {
    [ELossType.Sacrifice]: [
        `In a heroic display, ${Tokens.TPoke} sacrificed themselves to allow the rest of their team to set up and sweep ${Tokens.OName}'s team.`,
        `${Tokens.TPoke} knew that sacrificing themselves was necessary to give the team a better chance in future battles.`,
        `Sacrificing ${Tokens.TPoke} was a calculated decision to take out ${Tokens.OName}'s ${Tokens.OPoke} and secure the win.`,
        `${Tokens.TPoke} sacrificed themselves so that they could switch in a teammate with a type advantage and gain the upper hand.`,
        `Despite losing ${Tokens.TPoke}, they knew their sacrifice was the best move to make in the long run.`,
        `Even though ${Tokens.TPoke} was not very effective against ${Tokens.OName}'s ${Tokens.OPoke}, neither were their teammates.`,
        `The team were facing a tough ${Tokens.OPoke}. In order to secure the win, ${Tokens.TPoke} had to be sacrificed instead...`,
    ],
    [ELossType.Mistake]: [
        `${Tokens.OName}'s ${Tokens.OPoke} had a unique ability that completely caught ${Tokens.TPoke} off guard before it was knocked out.`,
        `${Tokens.OName}'s ${Tokens.OPoke} was holding a special item that gave an advantage against ${Tokens.TPoke}, who couldn't find a way to counter it.`,
        `${Tokens.TPoke} thought they could easily defeat a measly ${Tokens.OType} ${Tokens.OPoke}. But their attacks just didn't do enough damage.`,
        `Despite their careful preparations, ${Tokens.TPoke} was no match for ${Tokens.OName} and their powerful ${Tokens.OType} Pokémon.`,
        `Relying on ${Tokens.TPoke} proved to be a mistake, as they were unable to beat the diverse team of ${Tokens.OName}.`,
        `Underestimation of ${Tokens.OName}'s unconventional team ended up costing the life of ${Tokens.TPoke} in their battle against ${Tokens.OName}.`,
        `${Tokens.TPoke} was not prepared for ${Tokens.OName}'s ${Tokens.OPoke} to use ${Tokens.OAtk}.`,
        `In a moment of desperation, ${Tokens.TPoke} used the wrong move against ${Tokens.OName}'s ${Tokens.OType} Pokémon, resulting in a devastating kill.`,
    ],
    [ELossType.Luck]: [
        `${Tokens.TPoke} was paralyzed by ${Tokens.OName}'s ${Tokens.OPoke}'s ${Tokens.OAtk} and couldn't move for several turns, allowing the enemy to defeat them with ease.`,
        `${Tokens.TPoke} was facing a ${Tokens.OName}'s final Pokémon, ${Tokens.OPoke}, but they just kept landing critical hits.`,
        `${Tokens.TPoke} was doing well in the battle until ${Tokens.OName}'s ${Tokens.OPoke} landed a critical hit, which knocked them out in one blow.`,
        `Despite having a type advantage, ${Tokens.TPoke} kept missing their attack, allowing ${Tokens.OName}'s ${Tokens.OPoke} to easily retaliate.`,
        `In a tense battle, ${Tokens.TPoke} died to ${Tokens.OName}'s ${Tokens.OPoke} who landed critical hit after critical hit.`,
        `${Tokens.TPoke} was confused by ${Tokens.OName}'s ${Tokens.OPoke}, causing it to hurt itself and faint from repeated bad luck.`,
        `${Tokens.TPoke} was about to land the finishing blow on ${Tokens.OName}'s ${Tokens.OPoke}, but a sudden change caused the attack to miss, leaving ${Tokens.TPoke} open to devastating ${Tokens.OAtk}.`,
        `Despite feeling prepared, you didn't see ${Tokens.OPoke}'s explosion coming, easily taken out ${Tokens.TPoke}`,
        `The harsh sunlight blazed down on the battlefield, causing ${Tokens.TPoke}'s Water attacks to weaken and ${Tokens.OPoke} Fire attacks to strengthen.`,
        `The thick fog made it difficult to see ${Tokens.OName}'s ${Tokens.OPoke} clearly, making it impossible for ${Tokens.TPoke} to land hits, losing them the advantage.`,
        `${Tokens.TPoke} got unlucky with their moves repeatedly missing leading to their death.`,
        `${Tokens.TPoke} was lazy, and refused to Wake Up, giving ${Tokens.OName}'s ${Tokens.OPoke} plenty of time to defeat them.`,
        `${Tokens.OName}'s ${Tokens.OPoke} ${Tokens.OAtk} was super effective!`,
        `In their battle against ${Tokens.OName}, ${Tokens.TPoke} was quickly defeated by a well-placed ${Tokens.OAtk} from ${Tokens.OPoke}.`,
    ],
    [ELossType.Dramatic]: [
        `As ${Tokens.TPoke} soared through the skies, they were caught off guard by a wild ${Tokens.OPoke}, sending it crashing to the ground.`,
        `With a fearsome roar, ${Tokens.TPoke} launched itself at the seemingly harmless ${Tokens.OPoke}. But as they clashed, a sudden ${Tokens.OAtk} left ${Tokens.TPoke} unconscious.`,
        `The trusty ${Tokens.TPoke} stood bravely before a strange ${Tokens.OPoke}. As they began to battle, ${Tokens.TPoke} succumbed to the relentless ${Tokens.OAtk}s of the ${Tokens.OPoke}.`,
        `The battle-hardened ${Tokens.TPoke} stormed headfirst into a wild ${Tokens.OPoke}, eager to prove their strength. But as the battle raged on, ${Tokens.OPoke} gained the upper hand with a surprise ${Tokens.OAtk}.`,
        `${Tokens.TPoke} readied itself to beat a seemingly weak ${Tokens.OPoke}, until a strange aura began to emanate from its foe. Suddenly, ${Tokens.TPoke} was paralyzed and unable to retaliate before it was too late.`,
        `${Tokens.TPoke} stood confidently before an unassuming ${Tokens.OPoke}. But as they began to fight, ${Tokens.OPoke} was able to confuse ${Tokens.TPoke}, who eventually killed themselves in confusion.`,
        `${Tokens.TPoke} charged into battle with a fierce determination, eager to prove its strength against a ${Tokens.OPoke}. But it was knocked out from one clean ${Tokens.OAtk} that it wasn't expecting.`,
        `${Tokens.TPoke}, still young and inexperienced, bravely charged into battle against a fearsome ${Tokens.OPoke}. But as ${Tokens.OPoke} launched a deadly ${Tokens.OAtk}, ${Tokens.TPoke} was obliterated leaving nothing but ashes behind.`,
        `Though outmatched, ${Tokens.TPoke} fought with all its might. But a ${Tokens.OPoke} countered with a critical ${Tokens.OAtk} leaving ${Tokens.TPoke} unable to recover.`,
        `${Tokens.TPoke} was suddenly ambushed by a ${Tokens.OPoke} who overwhelmed them with deadly precision. In the chaos of battle, ${Tokens.TPoke} succumbed to the relentless onslaught of ${Tokens.OAtk}s.`,
        `${Tokens.TPoke} put up a good fight, but ${Tokens.OName}'s ${Tokens.OPoke} proved to be stronger, securing a victory with a well placed ${Tokens.OAtk}.`,
    ],
}

enum EType { Boss = 'boss', Wild = 'encounter', Trainer = 'trainer' }
interface ILvl { from?: number, to?: number }
interface IPokémon { name?: string, types?: [string, string] | [string] }
interface IBoss { name?: string, speciality?: string, type?: string }
interface IAttack { name?: string, type?: string }
interface ILocation { name?: string }

interface ICtx {
    nickname?: string,
    Pokémon?: IPokémon,
    type: EType,
    lvl?: ILvl
    opponent?: IPokémon,
    trainer?: IBoss,
    attack?: IAttack,
    location?: ILocation
}



export const randomTemplate = (category = ELossType.Dramatic): string => {
    const TCat = category === ELossType.Random
        ? Object.values(Templates).flat()
        : Templates[category]

  return TCat[Math.floor(Math.random() * TCat.length)]
}

export const format = (
    text: string | undefined,
    ctx: ICtx
): string  => {
    if (!text) return

    let otype: string = ''
    if (ctx?.trainer?.speciality) otype = ctx?.trainer?.speciality + ' type'
    if (ctx?.opponent?.types) otype =ctx?.opponent?.types[0] + ' type'

    let defaultOName
    if (ctx.type === EType.Wild) defaultOName = 'the wild'
    else defaultOName = 'their opponent'

    const res = text
        .replace(Tokens.TPoke, (ctx?.nickname ? `${ctx?.nickname} the ` : '') + ctx?.pokemon?.name)
        .replaceAll(Tokens.TPoke, ctx?.nickname || ctx?.pokemon.name)
        .replaceAll(Tokens.OName, ctx.type === EType.Trainer
            ? (((ctx?.trainer?.type || '') + ' ' + (ctx?.trainer?.name || '')).trim() || defaultOName)
            : (ctx?.trainer?.name || defaultOName))
        .replaceAll(Tokens.OPoke, ctx?.opponent?.name || 'Pokémon')
        .replaceAll(Tokens.OAtk, ctx?.attack?.name || 'attack')
        .replaceAll(Tokens.OType, otype)
        .replace(/ +/g, ' ')
        .replace(/the wild's (\w+)/g, 'the wild $1')
        .replace(/to use attack/g, 'to use a surprise attack')

    return capitalise(res)
}
