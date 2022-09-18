import { languages } from 'prismjs/components/prism-core'

import 'prismjs/components/prism-clike'
import 'prismjs/components/prism-ruby'

languages.ruby = {
  ...languages.ruby,
  'class-name': {
    pattern: /(\b[A-Z_]\w*[a-z]\w*\b)/,
  }
}
