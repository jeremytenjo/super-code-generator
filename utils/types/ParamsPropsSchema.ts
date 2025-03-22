export type ParamsPropsSchema<ParamsFileSchema extends ParamsFilePropsSchema> = {
  name: keyof ParamsFileSchema
  type: 'string'
  description: string
}

export type ParamsFilePropsSchema = {
  [key: string]: string
}
