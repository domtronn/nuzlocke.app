export const faq = (game, data, { routes, gyms, encounters}) => {
  const { title } = game
  const routesQuestion = [
    `How many encounters are there in a Pokémon ${title} Nuzlocke`,
    `There are ${routes.length} distinct routes and locations to encounter Pokémon in a Pokémon ${title} Nuzlocke run.`
  ]
  const encounterTypesQuestions = Object
        .entries(encounters)
        .map(([type, encs]) => [
          `How many ${type} Pokémon are there in Pokémon ${title}?`,
          `You can encounter and catch ${encs.length} different ${type} Pokémon in Pokémon ${title}.`
        ]).concat(
          [[`How many different Pokémon encounters are there in Pokémon ${title}?`,
            `You can encounter and catch ${Object.values(encounters).flat().length} different Pokémon in Pokémon ${title}.`]]
        )

  const gymGroupQuestions = Object
        .entries(gyms)
        .map(([group, gyms]) => [
          `How many ${group} fights are there in Pokémon ${title}?`,
          `There are ${gyms.length} ${group} fights in Pokémon ${title}.`
        ]).concat(
          [[`How many Boss fights are there in Pokémon ${title}?`,
            `There are ${Object.values(gyms).flat().length} Boss fights in total in Pokémon ${title}.`]]
        )

  const gymTeamQuestions = [
    ...gyms['Gym Leader'],
    ...gyms['Elite Four']
  ].map(g => data[g.value])
   .map(({ name, speciality, pokemon }) => [
      [
        `How many Pokémon does ${name} use in Pokémon ${title}?`,
        speciality
          ? `${name} has a team of ${pokemon.length} and uses only ${speciality} type Pokémon in Pokémon {title}.`
          : `${name} has a team of ${pokemon.length} in Pokémon {title}.`,
      ],
      [
        `What is the level cap for ${name} in Pokémon ${title}?`,
        `The level cap for ${name} is Level ${Math.max(...(pokemon || []).map(i=>i.level))} in Pokémon ${title}.`
      ],
      [
        `What team of Pokémon does ${name} use in Pokémon ${title}?`,
        `${name} uses a team of ${pokemon.slice(0, -1).map(p => p.name).join(', ')} ${pokemon.length > 1 ? '& ' : ''}${pokemon.slice(-1).map(p => p.name)}.`
      ]
    ]).flat()

  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      routesQuestion,
      ...encounterTypesQuestions,
      ...gymGroupQuestions,
      ...gymTeamQuestions
    ].map(([q, a]) => ({
      '@type': 'Question',
      name: q,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a
      }
    }))
  }
}
