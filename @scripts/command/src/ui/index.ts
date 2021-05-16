import inquirer from 'inquirer'
import * as SelectOptions from './options'
import * as Types from './types'
import { ValuesType } from 'utility-types'

type UISelectOptions = {
  yes?: boolean
  exclude?: string[]
  required?: boolean
}

/**
 * 创建单选UI
 * @param initialOptions 初始配置
 * @param choicesGenerator 选项生成器
 */
export function gSel<C extends Types.ChoicesGenerators>(initialOptions: inquirer.ListQuestionOptions = {}, choicesGenerator: C = SelectOptions as any, uiOptions: UISelectOptions) {
  const { yes = false, required = true, ...otherOptions } = uiOptions || {}
  return function <T extends keyof C>(type: T) {
    return async function (message: string, ...args: Parameters<C[T]>): Promise<ValuesType<Types.Choices>> {
      const context = choicesGenerator[type]
      if (!(typeof context === 'function')) {
        throw new Error(`Selector ${type} not found.`)
      }

      const choices = await context(otherOptions, ...args)
      if (!Array.isArray(choices)) {
        return null
      }

      if (yes) {
        return null
      }

      if (required === true && choices.length === 1) {
        return choices[0]
      }

      const { selected } = await inquirer.prompt({
        ...initialOptions,
        type: 'list',
        name: 'selected',
        message: message,
        choices: choices,
      })

      const choice = choices.find((item) => item.value === selected) || choices.find((item) => item.name === selected)
      return choice
    }
  }
}

/**
 * 创建多选UI
 * @param initialOptions 初始配置
 * @param choicesGenerator 选项生成器
 */
export function gMultiSel<C extends Types.ChoicesGenerators>(
  initialOptions: inquirer.CheckboxQuestionOptions = {},
  choicesGenerator: C = SelectOptions as any,
  uiOptions: UISelectOptions
) {
  const { yes = false, required = true, ...otherOptions } = uiOptions || {}
  return function <T extends keyof C>(type: T) {
    return async function (message: string, ...args: Parameters<C[T]>): Promise<Types.Choices> {
      const context = choicesGenerator[type]
      if (!(typeof context === 'function')) {
        throw new Error(`Selector ${type} not found.`)
      }

      const choices = await context(otherOptions, ...args)
      if (!Array.isArray(choices)) {
        return []
      }

      if (yes) {
        return []
      }

      if (required === true && choices.length === 1) {
        return choices
      }

      const { selected } = await inquirer.prompt({
        ...initialOptions,
        type: 'checkbox',
        name: 'selected',
        message: message,
        choices: choices,
      })

      return selected.map((value: string) => {
        return choices.find((item) => item.value === value) || choices.find((item) => item.name === value)
      })
    }
  }
}

/**
 * 单选
 * @param name 选择器名称
 * @param initialOptions 配置
 */
export function select<T extends keyof typeof SelectOptions>(type: T, uiOptions: UISelectOptions = {}, initialOptions?: inquirer.ListQuestionOptions) {
  return gSel(initialOptions, SelectOptions, uiOptions)(type)
}

/**
 * 多选
 * @param name 选择器名称
 * @param initialOptions 配置
 */
export function multiSelect<T extends keyof typeof SelectOptions>(type: T, uiOptions: UISelectOptions = {}, initialOptions?: inquirer.CheckboxQuestionOptions) {
  return gMultiSel(initialOptions, SelectOptions, uiOptions)(type)
}
