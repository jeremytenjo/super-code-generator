export type ParamsPropsSchema<ParamsFileSchema extends ParamsFilePropsSchema> = {
  name: keyof ParamsFileSchema
  type: 'input' | 'dropdown' | 'file' | 'tags'
  description: string
  options?: {
    value: ParamsFileSchema[keyof ParamsFileSchema]
  }[]
}

export type ParamsFilePropsSchema = {
  [key: string]: string | { name: string }[]
}
