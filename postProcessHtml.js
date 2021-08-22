const fs = require("fs")
const path = require("path")

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

const generateDocumentTitleFromName = (name) => {
    return `Learn Code Daily - ${name}`
}

const ignoredFiles = new Set(['WebsiteError.html', 'index.html'])
const convertSnakeToSpaces = (text) => {
    return text.replace(/_/g, ' ')
}
const htmlFiles = getAllFiles('_til_docs').filter( filePath => {
    const fileName = path.basename(filePath)
    return fileName.endsWith('.html') && !ignoredFiles.has(fileName)
})

htmlFiles.forEach( filePath => {
    const fileName = convertSnakeToSpaces(path.basename(filePath).slice(0, -5))
    fs.readFile(filePath, 'utf8', (error, html) => {
        if(error) {
            throw new Error(`Failure reading ${filePath}: ${error}`)
        }
        const titleRegex = /<title>.*<\/title>/
        const newHtml = html.replace(titleRegex,
            `<title>${generateDocumentTitleFromName(fileName)}</title>`)

        fs.writeFile(filePath, newHtml, 'utf-8', function (error) {
          if (error) throw Error(`Failure writing ${filePath} ${error}`)
        });
    })
})
