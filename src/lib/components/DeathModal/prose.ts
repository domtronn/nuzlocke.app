export enum Tokens {
    TPoke = '<TRAINER POKEMON>',
    TType = '<TRAINER POKEMON TYPE>',

    OName = '<OPPONENT NAME>',
    OType = '<OPPONENT POKEMON TYPE>',
    OPoke = '<OPPONENT POKEMON>',
    OAtk = '<OPPONENT ATTACK>'
}

const Templates = [
    `After sending in ${Tokens.TPoke} to battle, ${Tokens.TPoke} was shocked when ${Tokens.OName}'s ${Tokens.OPoke} easily defeated them.`,
    `Despite their best efforts, ${Tokens.TPoke} was no match for ${Tokens.OName}'s ${Tokens.OPoke}, who easily took down the ${Tokens.TPoke} with a powerful ${Tokens.OAtk} attack.`,
    `${Tokens.TPoke}'s overconfidence led them to underestimate a ${Tokens.OPoke}, resulting in their humiliating death.`,

    `In their battle against ${Tokens.OName}, ${Tokens.TPoke} was quickly defeated by a well-placed attack from ${Tokens.OPoke}.`,
    `Despite their confidence, ${Tokens.TPoke} was no match for ${Tokens.OName}'s ${Tokens.OPoke}, who had superior speed and strength.`,
    `${Tokens.TPoke} was easily taken out by ${Tokens.OName}'s ${Tokens.OPoke}, whose preparation and skill proved to be too much to handle.`,
    `In a moment of desperation, ${Tokens.TPoke} used the wrong move against ${Tokens.OName}'s ${Tokens.OType} Pokemon, resulting in a devastating kill.`,

    `Despite their careful preparations, ${Tokens.TPoke} was no match for the devious ${Tokens.OName} and their powerful ${Tokens.OType} Pokemon.`,
    `Relying on ${Tokens.TPoke} proved to be a mistake, as they were unable to beat the diverse team of ${Tokens.OName}.`,
    `The trainer's underestimation of ${Tokens.OName}'s unconventional team ended up costing the life of ${Tokens.TPoke} in their battle against ${Tokens.OName}.`,
    `Despite their best efforts, ${Tokens.TPoke} was unable to overcome the tricky strategies of ${Tokens.OName}'s sly ${Tokens.OPoke}.`,

    `${Tokens.TPoke} got unlucky with their moves repeatedly missing leading to their death.`,
    `Despite having a type advantage, ${Tokens.TPoke} missed their attack, allowing ${Tokens.OName}'s ${Tokens.OPoke} to land a critical hit.`,
    `In a tense battle, ${Tokens.TPoke} died to ${Tokens.OName}'s ${Tokens.OPoke} who landed critical hit after critcal hit.`,
    `${Tokens.TPoke} was doing well in the battle until ${Tokens.OName}'s ${Tokens.OPoke} landed a critical hit, which knocked them out in one blow.`,

    `In a heroic display, ${Tokens.TPoke} sacrificed themselves to allow the rest of their team to set up and sweep ${Tokens.OName}'s team.`,
    `${Tokens.TPoke} knew that sacrificing themselves was necessary to give the team a better chance in future battles.`,
    `Sacrificing ${Tokens.TPoke} was a calculated decision to take out ${Tokens.OName}'s ${Tokens.OPoke} and secure the win.`,
    `${Tokens.TPoke} sacrificed themselves so that they could switch in a teammate with a type advantage and gain the upper hand.`,
    `Despite losing ${Tokens.TPoke}, they knew their sacrifice was the best move to make in the long run.`
]

enum EType { Boss = 'boss', Wild = 'encounter', Trainer = 'trainer' }
interface ILvl { from?: number, to?: number }
interface IPokemon { name?: string, types?: [string, string] | [string] }
interface IBoss { name?: string, speciality?: string }
interface IAttack { name?: string, type?: string }
interface ILocation { name?: string }

interface ICtx {
    nickname?: string,
    pokemon?: IPokemon,
    type: EType,
    lvl?: ILvl
    opponent?: IPokemon,
    trainer?: IBoss,
    attack?: IAttack,
    location?: ILocation
}


export const randomTemplate = () => Templates[Math.floor(Math.random() * Templates.length)]
export const format = (
    text: string,
    ctx: ICtx
): string  => {
    let otype: string = ''
    if (ctx?.trainer?.speciality) otype = ctx?.trainer?.speciality + ' type'
    if (ctx?.opponent?.types) otype =ctx?.opponent?.types[0] + ' type'

    return text
        .replace(Tokens.TPoke, (ctx?.nickname ? `${ctx?.nickname} the ` : '') + ctx?.pokemon?.name)
        .replaceAll(Tokens.TPoke, ctx?.nickname || ctx?.pokemon.name)
        .replaceAll(Tokens.OName, ctx?.trainer?.name || 'their opponent')
        .replaceAll(Tokens.OPoke, ctx?.opponent?.name || 'pokemon')
        .replaceAll(Tokens.OAtk, ctx?.attack?.name || 'attack')
        .replaceAll(Tokens.OType, otype)
        .replace(/ +/g, ' ')
}
