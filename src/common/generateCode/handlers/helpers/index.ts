import * as changeCase from 'change-case'
import { lowerCase } from 'lower-case'
import wrapInTemplateLiteral, {
  WrapInTemplateLiteralProps,
} from './wrapInTemplateLiteral'
import addEmptyTemplateLiteral from './addEmptyTemplateLiteral'

export type SuperCodeGeneratorHelpersProps = {
  changeCase: typeof changeCase & { lowerCase: typeof lowerCase }
  wrapInTemplateLiteral: WrapInTemplateLiteralProps
  addEmptyTemplateLiteral: any
}

export default {
  changeCase: {
    ...changeCase,
    lowerCase,
  },
  wrapInTemplateLiteral,
  addEmptyTemplateLiteral,
}
