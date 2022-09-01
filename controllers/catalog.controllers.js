const fs = require('fs');
const consts = require('consts/server.consts')

let catalogService = () =>{
    return {
        getDirCtx: () => {
            return fs.readdirSync(`./${consts.currentPoint}`).map((val)=> ({
                name: getFileExt(val)[0],
                type: checkIfDir(val) ? 'folder' : val.split('.')[1],
                image: defFileImageString(checkIfDir(val) ? 'folder' : val.split('.')[1]),
                path: `${consts.currentPoint}/${val}`
            }));
        },
        changeDirPointer: (val) =>{
            if(val.path && val.path !== consts.endPoint){
                consts.currentPoint = val.path;
            } else if(!val.path && consts.currentPoint !== consts.endPoint){
                let arr = consts.currentPoint.split('/');
                arr.splice(arr.length - 1, 1);
                consts.currentPoint = arr.join('/');
            }
        },
        checkIfDir: (val)=>{
            return fs.lstatSync(`${consts.currentPoint}/${val}`).isDirectory();
        },
        defFileImageString: (val) => {
            let imageTypes = ['jpg', 'png', 'webp', 'jpeg', 'svg'];
            let docTypes = ['doc', 'docx', 'xlsx', 'xlsm', 'xlsb', 'csv'];

            if(imageTypes.indexOf(val) !== -1){
                return 'image'
            } else if (docTypes.indexOf(val) !== -1){
                return 'document'
            } else if(val === 'folder'){
                return 'folder'
            }
            return 'insert_drive_file';
        },
        createDir: (path) => {
            if(!fs.existsSync(path)){
                fs.mkdirSync(`${consts.currentPoint}/${path}`, {recursive: true})
            }
        },
        goToHomeFolder: () =>{
            consts.currentPoint = consts.endPoint;
        }
    }
}

module.exports = catalogService;