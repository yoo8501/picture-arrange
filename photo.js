
const fs = require('fs');
const promises_fs = require('fs').promises;
const path = require('path');
const targetFolderName = process.argv[2]


promises_fs.readdir(__dirname+ path.sep + targetFolderName).then(res=>{
    res.map(fileName=>{
        if(fileName[0] !== '.') {
            if(!fileName.split('.')[1]) {
                return false
            }
            const filePath = __dirname + path.sep + targetFolderName + path.sep + fileName

            promises_fs.stat(filePath).then(res=>{
                const dirPath = __dirname + path.sep + targetFolderName + path.sep
                const yearDirIsExist = fs.existsSync(dirPath + res.birthtime.getFullYear())
                const monthDirIsExist = fs.existsSync(dirPath + res.birthtime.getFullYear() + path.sep + res.birthtime.getMonth())
                if(yearDirIsExist) {
                    if(!monthDirIsExist) {
                        createDir(dirPath + res.birthtime.getFullYear() + path.sep ,res.birthtime.getMonth())
                    }
                } else {
                    createDir(dirPath ,res.birthtime.getFullYear())
                    if(!monthDirIsExist) {
                        createDir(dirPath + res.birthtime.getFullYear() + path.sep ,res.birthtime.getMonth())
                    }
                }
                const targetPath = dirPath + res.birthtime.getFullYear() + path.sep + res.birthtime.getMonth() + path.sep
                fileCheck(fileName,dirPath + fileName,targetPath)
            })

        }
    })

})

const createDir =  (path ,dirName) => {

    fs.mkdirSync(path + dirName)
    console.log(`created ${dirName} folder`)
}
const copyFile =  (filePath,dirPath,fileName) => {
    promises_fs.cp(filePath,dirPath+ path.sep + fileName).then(res=>{
        promises_fs.unlink(filePath).then(res=>{
            console.log('remove file  : '+ fileName)
        })
    }).catch(console.error)
}
const fileCheck = (fileName, filePath,targetPath) => {
    const splitArr =fileName.split('.')
    const extension = splitArr[splitArr.length - 1]
    switch (extension.toUpperCase()) {
        case 'AAE':
        case 'PNG': {
            const isExist = fs.existsSync(targetPath + 'capture')
            const capturePath = targetPath + 'capture'

            if(!isExist){
                createDir(targetPath,'capture')
                copyFile(filePath,capturePath,fileName)
            } else {
                copyFile(filePath,capturePath,fileName)
            }
            break
        }
        case 'MP4':
        case 'MOV': {
            const isExist = fs.existsSync(targetPath + 'video')
            const videoPath = targetPath + 'video'
            if(!isExist){
                createDir(targetPath,'video')
                copyFile(filePath,videoPath,fileName)
            } else {
                copyFile(filePath,videoPath,fileName)
            }
            break

        }
        default:
            const imgNameSplited=fileName.split('_')
            if(imgNameSplited[1][0] === 'E') {
                const isExist = fs.existsSync(targetPath + 'edit')
                const editPath = targetPath + 'edit'
                if(!isExist){
                    createDir(targetPath,'edit')
                    copyFile(filePath,editPath,fileName)
                } else {
                    copyFile(filePath,editPath,fileName)
                }
            } else {
                const isExist = fs.existsSync(targetPath + 'original')
                const originalPath = targetPath + 'original'

                if(!isExist){
                    createDir(targetPath,'original')
                    copyFile(filePath,originalPath,fileName)
                } else {
                    copyFile(filePath,originalPath,fileName)
                }
            }
            break
    }
}