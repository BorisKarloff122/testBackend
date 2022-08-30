const express = require('express');
const router = express.Router();
const fs = require('fs');

let consts = {
    endPoint: 'workspace',
    currentPoint: 'workspace'
}


router.get('/home', (req, res) => {
    goToHomeFolder();
    res.send();
});

router.get('/getStructure', (req, res) => {
    res.send(getDirCtx());
});

router.post('/moveToDir',(req,res)=>{
    changeDirPointer(req.body);
    res.send()
});

router.get('/createDir', (req, res)=>{
    createDir(req.query.path)
    res.send();
});

router.post('/removeElement', (req,res)=>{
    remover(req.body)
    res.send()
});

router.post('/uploadElement', (req, res, next)=>{
    req.headers = {'Content-Type': 'multipart/form-data'}
    res.send(saveFile(req.files))
})


router.post('/openCatalog', (req, res)=>{
    changeDirPointer(req.body);
    res.send();
})


const remover = (elem) =>{
    if(elem.type === 'folder'){
        removeDir(elem.path);
        return
    }
    removeFile(elem.path);
}


const getDirCtx = () => {
   return fs.readdirSync(`./${consts.currentPoint}`).map((val)=> ({
            name: getFileExt(val)[0],
            type: checkIfDir(val) ? 'folder' : getFileExt(val)[1],
            image: defFileImageString(checkIfDir(val) ? 'folder' : getFileExt(val)[1]),
            path: `${consts.currentPoint}/${val}`
   }));
}


const checkIfDir = (val)=>{
    return fs.lstatSync(`${consts.currentPoint}/${val}`).isDirectory();
}

const goToHomeFolder = () =>{
    consts.currentPoint = consts.endPoint;
}

const changeDirPointer = (val) =>{
    if(val.path && val.path !== consts.endPoint){
        consts.currentPoint = val.path;
    } else if(!val.path && consts.currentPoint !== consts.endPoint){
        let arr = consts.currentPoint.split('/');
        arr.splice(arr.length - 1, 1);
        consts.currentPoint = arr.join('/');
    }
}

const defFileImageString = (val) => {
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

}

const createDir = (path) => {
    if(!fs.existsSync(path)){
        fs.mkdirSync(`${consts.currentPoint}/${path}`, {recursive: true})
    }
}

const removeFile = (path) =>{
    fs.unlinkSync(`./${path}`)
}

const removeDir = (path) =>{
    fs.rmSync(path, { recursive: true, force: true });
}


const getFileExt = (val) =>{
    return val.split('.');
}

const saveFile = (val) =>{
    if(!val){
        return {status: 400, message: 'No files were uploaded'}
    }

    let returnVal = {}
    Object.keys(val).forEach((i, index)=> {
        val[i].mv(`./${consts.currentPoint}/${i}`, (err) => {
            if (err) {
                returnVal = {status: 400, message: 'Da error occurred'};
            }
            returnVal = {status: "success", path: consts.currentPoint};
        });
    });
    return returnVal;
}

module.exports = router;
