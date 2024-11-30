const fs = require('fs')
const { exec } = require('child_process')

function updatePackageName(props) {
  const packageJsonPath = props.packageJsonPath
  const newName = props.newName

  const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))
  const originalName = packageJson.name

  packageJson.name = newName
  fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2))

  return originalName
}

function publishPackage() {
  exec('npm publish --access public', (error, stdout, stderr) => {
    if (error) {
      console.error(`Error: ${error.message}`)
      return
    }
    if (stderr) {
      console.error(`Stderr: ${stderr}`)
      return
    }
    console.log(`Stdout: ${stdout}`)
  })
}

function main() {
  const packageJsonPath = './package.json'
  const newName = '@scg/super-code-generator'

  const originalName = updatePackageName({ packageJsonPath, newName })

  publishPackage({})

  updatePackageName({ packageJsonPath, newName: originalName })
}

main()
