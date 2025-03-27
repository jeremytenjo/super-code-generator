export type ParamsPropsSchema<
  ParamsFileSchema extends ParamsFilePropsSchema,
  ParamsFileOptionsSchema extends ParamsFileDropdownOptions,
> = {
  name: keyof ParamsFileSchema
  type: 'input' | 'dropdown'
  description: string
  options?: {
    value: ParamsFileOptionsSchema
  }[]
}

export type ParamsFilePropsSchema = {
  [key: string]: string
}

export type ParamsFileDropdownOptions = string
