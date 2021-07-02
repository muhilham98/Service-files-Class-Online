const mongoose = require("mongoose");
const File = require('../models/File');
const fs = require('fs-extra');
const path = require('path');
//const base64Img = require('base64-img');
const isBase64 = require('is-base64');
var Buffer = require('buffer/').Buffer;
const  Validator  = require('fastest-validator');

const validator = new Validator();


module.exports = {
    addFile: async (req,res) => {

        const validate = validator.validate(req.body, {
            name: 'string|empty:false',
        });

        if(validate.length) {
            return res.status(400).json({
                status:'error',
                message: validate
            });
        };
        const { name, file } = req.body;
        const nameToLowerCase = name.toLowerCase();
        if(!isBase64(file, { mimeRequired:true })){
            return res.status(400).json({
                status: 'error',
                message: 'invalid base64 (mime required)'
            })
        }
        const fileSubstring = file.substring(28);
        const buff = new Buffer(fileSubstring, 'base64');
        filename = `${nameToLowerCase}-${Date.now()}.pdf`;
        fs.writeFile(`./public/files/${filename}`, buff);
        //filename = `${name}-${Date.now()}.pdf`;
        const data = await File.create({
            name: nameToLowerCase,
            fileUrl: `files/${filename}`
        });
        return res.json({
            status: 'success',
            message: 'add file pdf successfully',
            data: {
                _id: data._id,
                name: nameToLowerCase,
                fileUrl: `${req.get('host')}/${data.fileUrl}`,
                created_at: data.created_at
            }
        });

    },

    getFiles: async(req,res) => {
        const { name } = req.query;
        //console.log(name);
        if(name){
            const data = await File.find({ name: { $regex: '.*' + name.toLowerCase() + '.*' }});
            
            const mappedData = data.map((m)=>{
                m.fileUrl = `${req.get('host')}/${m.fileUrl}`;
                return m;
            });
    
            return res.json({
                status :'success',
                message: 'get pdf successfully',
                data: mappedData,
            })
        }
        const data = await File.find();
        
        const mappedData = data.map((m)=>{
            m.fileUrl = `${req.get('host')}/${m.fileUrl}`;
            return m;
        });

        return res.json({
            status :'success',
            message: 'get all pdf successfully',
            data: mappedData,
        })
       
    },

    deleteFile: async(req,res) => {

        const { id } = req.params;

        const validUserId = mongoose.Types.ObjectId.isValid(id);
        if(!validUserId){
            return res.status(400).json({
                status: 'error',
                message: 'invalid id'
            });
        }
        
        const data = await File.findOne({ _id: id });

        if(!data){
            return res.status(404).json({ 
                status: 'error', 
                message: 'file pdf not found or not exist'
            });
        }
        await fs.unlink(path.join(`public/${data.fileUrl}`), async(err) => {
            if(err){
                return res.status(400).json({ 
                    status: 'error', 
                    message: err.message
                });
            }
            await data.remove();
            return res.json({
                status: 'success',
                message: 'file deleted successfully'
            })
        });      

    }
}