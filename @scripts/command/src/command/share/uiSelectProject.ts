import { select, multiSelect } from '../../ui'
import { Project } from '../../services/workspace'

type UISelectProjectOptions = {
  yes?: boolean
  include?: string[]
  exclude?: string[]
}

export default async function uiSelectProject(messages: string, multiple = false, options?: UISelectProjectOptions): Promise<Project[]> {
  if (multiple) {
    const result = await multiSelect('project', options)(messages)
    return result.map(({ value }) => value)
  }

  const result = await select('project', options)(messages)
  return result ? [result.value] : []
}
