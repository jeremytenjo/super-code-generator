export type ParamsPropsSchema<ParamsFileSchema extends ParamsFilePropsSchema> = {
  name: keyof ParamsFileSchema
  type: 'input' | 'dropdown'
  description: string
  options?: string[]
}

export type ParamsFilePropsSchema = {
  [key: string]: string
}
