const fs = require("fs")
const path = require("path")


const baseName = '_til_docs'
const baseDir = path.resolve(baseName)

// https://coderrocketfuel.com/article/recursively-list-all-the-files-in-a-directory-using-node-js
const getAllFiles = function(dirPath, arrayOfFiles) {
    let files = fs.readdirSync(dirPath)

    arrayOfFiles = arrayOfFiles || []

    files.forEach(function(file) {
        if (fs.statSync(dirPath + "/" + file).isDirectory()) {
            arrayOfFiles = getAllFiles(dirPath + "/" + file, arrayOfFiles)
        } else {
            arrayOfFiles.push(path.join(__dirname, dirPath, "/", file))
        }
    })

    return arrayOfFiles
}


const ignoredFiles = new Set(['WebsiteError.html', 'index.html'])

const convertSnakeToSpaces = (text) => {
    return text.replace(/_/g, ' ')
}

const htmlFiles = getAllFiles(baseName).filter( filePath => {
    const fileName = path.basename(filePath)
    return fileName.endsWith('.html') && !ignoredFiles.has(fileName)
})

const getTopicNameFromFilePath = (filePath) => {
    // Slice off the .html part
    return path.basename(filePath).slice(0, -5)
}

const getDirInfo = (filePath) => {
    return {
        name: path.basename(filePath),
        path: path.dirname(filePath)
    }
}

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

    const titleString = stack.reverse().join(' / ')
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
