export type ParamsPropsSchema<ParamsFileSchema extends ParamsFilePropsSchema> = {
  name: keyof ParamsFileSchema
  type: 'input' | 'dropdown' | 'file'
  description: string
  options?: {
    value: ParamsFileSchema[keyof ParamsFileSchema]
  }[]
  /**
   * When set to a tags array structure, enables multi-select (canPickMany) for the parameter.
   * The return value will be formatted as `{ name: string }[]` instead of a single value.
   */
  tags?: { name: string }[]
}

export type ParamsFilePropsSchema = {
  [key: string]: string | { name: string; isTag?: boolean }[]
}
