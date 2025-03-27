export type ParamsPropsSchema<ParamsFileSchema extends ParamsFilePropsSchema> = {
  name: keyof ParamsFileSchema
  type: 'input' | 'dropdown'
  description: string
  options?: {
    value: keyof ParamsFileSchema['options']
  }[]
}

export type ParamsFilePropsSchema = {
  [key: string]: {
    name: string
    options?: {
      value: string
    }[]
  }
}
