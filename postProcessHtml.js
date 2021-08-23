const fs = require("fs")
const path = require("path")
const utils = require('./utils')

const baseName = '_til_docs'
const baseDir = path.resolve(baseName)


const ignoredFiles = new Set(['WebsiteError.html', 'index.html'])

const convertSnakeToSpaces = (text) => {
    return text.replace(/_/g, ' ')
}

const htmlFiles = utils.getAllFiles(baseName).filter( filePath => {
    const fileName = path.basename(filePath)
    return fileName.endsWith('.html') && !ignoredFiles.has(fileName)
})

const getNameFromFilePath = (filePath) => {
    const baseName = path.basename(filePath)
    if(baseName.endsWith('.html')) {
        return convertSnakeToSpaces(baseName.slice(0, -5))
    }
    return convertSnakeToSpaces(baseName)
}

const getHTMLTitle = (filePath) => {
    let stack = []


    let parent = path.dirname(filePath)
    stack.push(getNameFromFilePath(filePath))

    // Should never hit the root but just in case to protect against infinite loop
    while(parent !== baseDir && parent !== '/') {
        stack.push(getNameFromFilePath(parent))
        parent = path.dirname(parent)
    }

    const titleString = stack.reverse().join(' ')
    return `Learn Code Daily - ${titleString}`
}

htmlFiles.forEach( filePath => {
    fs.readFile(filePath, 'utf8', (error, html) => {
        if(error) {
            throw new Error(`Failure reading ${filePath}: ${error}`)
        }
        const titleRegex = /<title>.*<\/title>/
        const newHtml = html.replace(titleRegex,
            `<title>${getHTMLTitle(filePath)}</title>`)

        fs.writeFile(filePath, newHtml, 'utf-8', function (error) {
          if (error) throw Error(`Failure writing ${filePath} ${error}`)
        });
    })
})
