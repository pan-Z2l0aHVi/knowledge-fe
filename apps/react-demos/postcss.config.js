import postcss100vhFix from 'postcss-100vh-fix'
import postcssPresetEnv from 'postcss-preset-env'

export default {
  plugins: [postcss100vhFix(), postcssPresetEnv()]
}
