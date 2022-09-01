const {consts} = require("../consts/server.consts");
const fs = require("fs");


let fileService = () => {
    return{
        removeSelector: (elem) =>{
            if(elem.type === 'folder'){
                this.removeDir(elem.path);
                return
            }
            this.removeFile(elem.path);
        },
        saveFile: (val) =>{
            if(!val){
                return {status: 400, message: 'No files were uploaded'}
            }

            let returnVal = {}
            Object.keys(val).forEach((i, index)=> {
                val[i].mv(`./${consts.currentPoint}/${i}`, (err) => {
                    if (err) {
                        returnVal = {status: 400, message: 'Error occurred during uploading'};
                    }
                    returnVal = {status: "success", path: consts.currentPoint};
                });
            });
            return returnVal;
        },
        removeFile: (path) =>{
            fs.unlinkSync(`./${path}`)
        },
        removeDir: (path) =>{
            fs.rmSync(path, { recursive: true, force: true });
        }

    }
}

module.exports = fileService