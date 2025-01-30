Start of javascript and typescript files instructions
- Always use objects as a functions arguments named props
- Format the Props type as `${functionName}Props`, make sure the name is pascal case
- Always export the props type
- Do not spread the props object in the function
Use the following structure when creating a function
```
export type ${propsName} = {name: string}
    export default async function ${camelCase}(props: ${propsName}) {
      const data = props.name
      return { data }
    }
    export type ${returnName} = ReturnType<typeof ${camelCase}>
```
End of javascript and typescript files instructions