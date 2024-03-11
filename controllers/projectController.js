const {sequelize} = require('../models/index')
const DataTypes = require('sequelize')
const Project = require('../models/project')(sequelize, DataTypes);
const cloudinary= require('../utilis/cloudinary');



//create project post
exports.create = async (req, res) => {
    const {title, content, } = req.body;
    const { file } = req;
    // console.log(req.body,req.file ? true :false);
    try{
        if(!title || !content || !file){
           return res.status(400).json({success: false,message:'Please provide project detail.'})
        }
        const currentPost = await Project.findOne({where: {title,content,file}});
        if(currentPost){
            return res.status(406).json({success: false,message:'Already created, Please use another post.'})
         }
        const result = await cloudinary.uploader.upload(req.file.path, {
            folder: "Project Post",
            width: 1200,
            crop: "scale"
        });
        const post = await Project.create({
            title, 
            content, 
            file:{
                public_id: result.public_id,
                url: result.secure_url },
        });

        return res.status(201).json({success: true, post})

     }catch(err){
        console.log(err)
        return res.status(500).json({success: false, message:'Failed to create project post.', error:err.message});
    }
}



//show project by id
exports.project = async (req, res) => {
    try{
        if(!req.params.id){
            return res.status(400).json({success: false, message: 'Please use an id!'});
        }
        const post = await Project.findOne({where: {id: req.params.id}, });
        return res.status(200).json({success: true, post});
    }catch(err){
        console.error(err);
        return res.status(500).json({success: false, message:'Failed to show a post.', error:err.message});
    }  
}




//show all project posts
exports.getAll = async (req, res) => {
    try{
        const posts = await Project.findAll();
        return res.status(200).json({success: true, posts});
    }catch(err){
        console.error(err);
        return res.status(500).json({success: false, message:'Failed to show a post.', error:err.message});
    }  
}



//update post
exports.edit = async (req, res,next) =>{
    try{
        const {title, content,} = req.body;
        const {file}=req;

        if(!req.params.id){
            return res.status(400).json({success: false, message: 'Please use an id!'});
        }

        if(!title && !content && !file){
            return res.status(403).json({success: false,message: "Please provide edited project post detail."});
        }
        const currentPost = await Project.findOne({where: {id: req.params.id} });
        if (!currentPost) {
            return res.status(404).json({success: false,message: "Project post not found!"});
        }
        const data = {
            title: title || currentPost.title,
            content: content || currentPost.content,
            file:  file || currentPost.file,
        }
        if(req.file ){
            const ImgId = currentPost.file.public_id;
            if (ImgId) {
                await cloudinary.uploader.destroy(ImgId);
            }
            const newImage = await cloudinary.uploader.upload(req.file.path, {
                 folder: 'Project Post', 
                 width: 1200, 
                 crop: "scale"
            });

            data.image = {
                public_id: newImage.public_id,
                url: newImage.secure_url
            }
            console.log("data",data)
        };
            currentPost = data;
            await currentPost.save();
            return res.status(200).json({
                success: true,
                message: "Updated successfully.",
                postUpdated: currentPost
            })
    }catch(error){
        console.error('Error:', error);
        return res.status(500).json({success:false,error:error.message});
    }
}


//delete post
exports.deletePost = async (req, res,next) =>{
    try{
        if(!req.params.id){
            return res.status(400).json({success: false, message: "Please provide deleted project post id!", });
        }
        const currentPost = await Project.findOne({where: {id: req.params.id} });
        if (!currentPost) {
            return res.status(404).json({success: false, message: "Project post not found!", });
        }

        // delete the post image in cloudinary
        const ImgId = currentPost.file && currentPost.file.public_id;
        
        if(ImgId){
            await cloudinary.uploader.destroy(ImgId);
        }

        await currentPost.destroy();
        return res.status(200).json({success: true, message:"Successfully deleted."})
    }catch (error){
        return res.status(500).json({success:false,error:error.message});
    }
}
