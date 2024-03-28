import hljs from 'highlight.js/lib/core'
import { createLowlight } from 'lowlight'

export const lowlight = createLowlight()

function langFactory(lang: string) {
  return (res: typeof import('highlight.js/lib/languages/*')) => {
    hljs.registerLanguage(lang, res.default)
    lowlight.register(lang, res.default)
  }
}

function registerLangAlias(lang: string, alias: string[]) {
  hljs.registerAliases(alias, { languageName: lang })
  lowlight.registerAlias(lang, alias)
}

export async function loadLanguages() {
  const langList = [
    import('highlight.js/lib/languages/bash').then(langFactory('bash')),
    import('highlight.js/lib/languages/c').then(langFactory('c')),
    import('highlight.js/lib/languages/cpp').then(langFactory('cpp')),
    import('highlight.js/lib/languages/csharp').then(langFactory('csharp')),
    import('highlight.js/lib/languages/css').then(langFactory('css')),
    import('highlight.js/lib/languages/diff').then(langFactory('diff')),
    import('highlight.js/lib/languages/go').then(langFactory('go')),
    import('highlight.js/lib/languages/graphql').then(langFactory('graphql')),
    import('highlight.js/lib/languages/java').then(langFactory('java')),
    import('highlight.js/lib/languages/javascript').then(langFactory('javascript')),
    import('highlight.js/lib/languages/json').then(langFactory('json')),
    import('highlight.js/lib/languages/kotlin').then(langFactory('kotlin')),
    import('highlight.js/lib/languages/less').then(langFactory('less')),
    import('highlight.js/lib/languages/lua').then(langFactory('lua')),
    import('highlight.js/lib/languages/markdown').then(langFactory('markdown')),
    import('highlight.js/lib/languages/objectivec').then(langFactory('objectivec')),
    import('highlight.js/lib/languages/perl').then(langFactory('perl')),
    import('highlight.js/lib/languages/php').then(langFactory('php')),
    import('highlight.js/lib/languages/php-template').then(langFactory('php-template')),
    import('highlight.js/lib/languages/plaintext').then(langFactory('plaintext')),
    import('highlight.js/lib/languages/python').then(langFactory('python')),
    import('highlight.js/lib/languages/r').then(langFactory('r')),
    import('highlight.js/lib/languages/ruby').then(langFactory('ruby')),
    import('highlight.js/lib/languages/rust').then(langFactory('rust')),
    import('highlight.js/lib/languages/scss').then(langFactory('scss')),
    import('highlight.js/lib/languages/shell').then(langFactory('shell')),
    import('highlight.js/lib/languages/sql').then(langFactory('sql')),
    import('highlight.js/lib/languages/swift').then(langFactory('swift')),
    import('highlight.js/lib/languages/typescript').then(langFactory('typescript')),
    import('highlight.js/lib/languages/vbnet').then(langFactory('vbnet')),
    import('highlight.js/lib/languages/wasm').then(langFactory('wasm')),
    import('highlight.js/lib/languages/xml').then(langFactory('xml')),
    import('highlight.js/lib/languages/yaml').then(langFactory('yaml'))
  ]
  if (Promise.allSettled as unknown) {
    await Promise.allSettled(langList)
  } else {
    await Promise.all(langList)
  }
  registerLangAlias('markdown', ['md'])
  registerLangAlias('html', ['vue'])
  registerLangAlias('javascript', ['js', 'jsx'])
  registerLangAlias('typescript', ['ts', 'tsx'])
}
