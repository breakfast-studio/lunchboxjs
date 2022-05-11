const prompts = require('prompts')
const { red, reset } = require('kolorist')
const fs = require('fs')
const path = require('path')
const { kebabCase } = require('lodash')

function copy(src, dest) {
    const stat = fs.statSync(src)
    if (stat.isDirectory()) {
        copyDir(src, dest)
    } else {
        fs.copyFileSync(src, dest)
    }
}

function copyDir(srcDir, destDir) {
    fs.mkdirSync(destDir, { recursive: true })
    for (const file of fs.readdirSync(srcDir)) {
        const srcFile = path.resolve(srcDir, file)
        const destFile = path.resolve(destDir, file)
        copy(srcFile, destFile)
    }
}

function emptyDir(dir) {
    if (!fs.existsSync(dir)) {
        return
    }
    for (const file of fs.readdirSync(dir)) {
        const abs = path.resolve(dir, file)
        // baseline is Node 12 so can't use rmSync :(
        if (fs.lstatSync(abs).isDirectory()) {
            emptyDir(abs)
            fs.rmdirSync(abs)
        } else {
            fs.unlinkSync(abs)
        }
    }
}

const main = async () => {
    let targetDir = ''
    let targetName = ''
    let result = {}

    try {
        result = await prompts([
            // get example name
            {
                type: targetDir ? null : 'text',
                name: 'targetDir',
                message: reset('Demo name (human-readable):'),
                onState: (state) => {
                    targetName = state.value.trim()
                    targetDir = kebabCase(targetName)
                },
            },
            // overwrite?
            {
                type: () => {
                    const targetPath = path.resolve(`demo/${targetDir}`)
                    return !fs.existsSync(targetPath) ? null : 'confirm'
                },
                name: 'overwrite',
                message: () =>
                    `${targetDir} is not empty. Remove existing files and continue?`,
            },
        ])
    } catch (cancel) {
        console.log(cancel.message)
        return
    }

    if (!targetDir) {
        console.log(red('Missing example name. Exiting early.'))
        return
    }

    const finalPath = path.resolve(`demo/${targetDir}`)

    if (fs.existsSync(finalPath)) {
        // not deleting existing demo, exit early
        if (!result.overwrite) {
            console.log(
                red('Demo exists and overwrite prevented. Exiting early.')
            )
            return
        } else {
            // delete existing demo
            emptyDir(finalPath)
        }
    }

    // copy template
    copyDir(path.resolve('demo/template'), finalPath)

    // add to examples directory
    const demosJsonPath = 'demo/home/demos.json'
    const demos = JSON.parse(fs.readFileSync(path.resolve(demosJsonPath)))
    demos.push({ title: targetName, url: `/demo/${targetDir}/` })
    fs.writeFileSync(path.resolve(demosJsonPath), JSON.stringify(demos))
}

main()
