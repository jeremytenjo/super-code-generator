import * as changeCase from 'change-case'
import { lowerCase } from 'lower-case'
import wrapInTemplateLiteral, {
  WrapInTemplateLiteralProps,
  WrapInTemplateLiteralReturn,
} from './wrapInTemplateLiteral'
import addEmptyTemplateLiteral from './addEmptyTemplateLiteral'

export type SuperCodeGeneratorHelpersProps = {
  changeCase: typeof changeCase & { lowerCase: typeof lowerCase }
  wrapInTemplateLiteral: (
    props: WrapInTemplateLiteralProps,
  ) => WrapInTemplateLiteralReturn
  addEmptyTemplateLiteral: any
}

const helpers: SuperCodeGeneratorHelpersProps = {
  changeCase: {
    ...changeCase,
    lowerCase,
  },
  wrapInTemplateLiteral,
  addEmptyTemplateLiteral,
}

export default helpers
