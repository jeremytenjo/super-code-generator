import * as changeCase from 'change-case'
import { lowerCase } from 'lower-case'
import wrapInTemplateLiteral from './wrapInTemplateLiteral'
import addEmptyTemplateLiteral from './addEmptyTemplateLiteral'

export default {
  changeCase: {
    ...changeCase,
    lowerCase,
  },
  wrapInTemplateLiteral,
  addEmptyTemplateLiteral,
}
