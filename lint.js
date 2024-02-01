const utils = require('./utils')
const path = require('path')
const files = utils.getAllFiles('til_docs')


// A quick script to lint for snake case filenames so we
const snakeCaseRegex = /^[A-Z]+[a-z]*(_[A-Z]+[a-z]*)*(\.md)?$/
const ignoredFiles = new Set(['index.md', 'JavaScript.md',
    'TypeScript.md', 'DynamoDB.md', 'Zephyr_7B.md'])

const invalidFiles = files.filter( name => {
    const baseName = path.basename(name)
    const isMarkdown = baseName.endsWith('.md')
    if(!isMarkdown || ignoredFiles.has(baseName)) return false

    return !snakeCaseRegex.test(baseName)
})

if(invalidFiles.length) {
    console.error(invalidFiles)
    throw new Error('Files not in snake case not found.')
}
