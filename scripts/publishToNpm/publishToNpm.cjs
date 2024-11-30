const fs = require('fs')
const { exec } = require('child_process')

function updatePackageName(props) {
  const packageJsonPath = './package.json'
  const newName = props.newName

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const originalName = packageJson.name

  packageJson.name = newName
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

  return originalName
}

function main() {
  const newName = '@jeremytenjo/super-code-generator'

  const originalName = updatePackageName({ newName })

  exec('npm publish --access public', (error, stdout, stderr) => {
    if (error) {
      updatePackageName({ newName: originalName })

      return
    }
    if (stderr) {
      updatePackageName({ newName: originalName })

      return
    }
    updatePackageName({ newName: originalName })
  })
}

main()
