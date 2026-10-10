import { format } from 'oxfmt'

export default async function prettifyFile(props: {
  oxfmtConfig: object
  content: string
}) {
  try {
    const prettifiedContent = await format('generated.ts', props.content, {
      ...props.oxfmtConfig,
      singleQuote: true,
    }).then((result) => result.code)

    return prettifiedContent
  } catch (error) {
    return props.content
  }
}
