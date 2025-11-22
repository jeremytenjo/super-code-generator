export type ParamsPropsSchema<ParamsFileSchema extends ParamsFilePropsSchema> = {
  name: keyof ParamsFileSchema
  type: 'input' | 'dropdown' | 'file'
  description: string
  options?: {
    value: ParamsFileSchema[keyof ParamsFileSchema]
  }[]
  tags?: { name: string }[]
}

export type ParamsFilePropsSchema = {
  [key: string]: string | { name: string }[]
}
