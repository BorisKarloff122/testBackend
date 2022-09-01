const express = require('express');
const router = express.Router();
const fileService = require('controllers/file-system.controllers')
const catalogService = require('controllers/catalog.controllers')

router.get('/home', (req, res) => {
    goToHomeFolder();
    res.send();
});

router.get('/getStructure', (req, res) => {
    res.send(catalogService.getDirCtx());
});

router.post('/moveToDir',(req,res)=>{
    catalogService.changeDirPointer(req.body);
    res.send()
});

router.get('/createDir', (req, res)=>{
    catalogService.createDir(req.query.path)
    res.send();
});

router.post('/removeElement', (req,res)=>{
    fileService.removeSelector(req.body)
    res.send()
});

router.post('/uploadElement', (req, res, next)=>{
    req.headers = {'Content-Type': 'multipart/form-data'}
    res.send(fileService.saveFile(req.files))
})


router.post('/openCatalog', (req, res)=>{
    catalogService.changeDirPointer(req.body);
    res.send();
})

module.exports = router;
