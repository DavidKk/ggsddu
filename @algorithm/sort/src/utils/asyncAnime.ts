import anime, { AnimeParams } from 'animejs'

const asyncAnime = (params: AnimeParams): Promise<void> => new Promise((resolve) => anime({ ...params, complete: () => resolve() }))

export default asyncAnime
