export type Choices = Array<{ name: string; value?: any }>
export type ChoicesGenerator = (...args: any[]) => Promise<Choices>
export type ChoicesGenerators = Record<string, ChoicesGenerator>
