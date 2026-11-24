const Post=require('../models/postModel')
const User=require('../models/userModel')
const path=require('path')
const fs=require('fs')
const {v4:uuid}=require('uuid')
const HttpError=require('../models/errorModel')

const createPost=async (req,res,next)=>{
    try{
let {title,category,description}=req.body;
if(!title || !category || !req.files){
   return next(new HttpError("Fill in all fields and choose thumbnail.",422))

}
const {thumbnail}=req.files;
if(thumbnail.size >2000000){
    return next(new HttpError("Thumbnail too big.File should be less than 2mb."))
}
let fileName=thumbnail.name;
let splittedFilename=fileName.split('.')
let newFilename=splittedFilename[0]+uuid()+"."+splittedFilename[splittedFilename.length-1]
thumbnail.mv(path.join(__dirname, '..', 'uploads', newFilename),async(err)=>{
if(err){
    return next(new HttpError(err))
}else {
    const newPost=await Post.create({title,category,description,thumbnail:newFilename,creator:req.user.id})
if(!newPost){
 return next(new HttpError("Post couldn't be created.",422))   
}
    const currentUser=await User.findById(req.user.id);
const userPostCount = (currentUser.posts || 0) + 1;
    await User.findByIdAndUpdate(req.user.id, {
    posts: userPostCount
});
    res.status(201).json(newPost)
}
})
    }catch(error){
        return next(new HttpError(error))
    }
}


const getPosts = async (req, res, next) => {
    try {
        const posts = await Post.find().sort({ updatedAt: -1 });

        res.status(200).json(posts);

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
}


const getPost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        const post = await Post.findById(postId);

        if (!post) {
            return next(new HttpError("Post not found.", 404));
        }

        res.status(200).json(post);

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
}



const getCatPosts = async (req, res, next) => {
    try {
        const { category } = req.params;

        const catPosts = await Post.find({ category }).sort({ createdAt: -1 });

        res.status(200).json(catPosts);

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
}



const getUserPosts = async (req, res, next) => {
    try {
        const { id } = req.params;

        const posts = await Post.find({ creator: id })
            .sort({ createdAt: -1 });

        res.status(200).json(posts);

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
}


const editPost = async (req, res, next) => {
    try {
        let fileName;
        let newFilename;
        let updatedPost;

        const postId = req.params.id;
        let { title, category, description } = req.body;

        if (!title || !category || !description || description.length < 12) {
            return next(new HttpError("Fill in all fields.", 422));
        }

        const oldPost = await Post.findById(postId);

        if (!oldPost) {
            return next(new HttpError("Post not found.", 404));
        }

        if (!req.files || !req.files.thumbnail) {

            updatedPost = await Post.findByIdAndUpdate(
                postId,
                { title, category, description },
                { new: true, runValidators: true }
            );

        } else {

            const { thumbnail } = req.files;

            if (thumbnail.size > 2000000) {
                return next(new HttpError("Thumbnail too big. Should be less than 2mb.", 422));
            }

            fileName = thumbnail.name;
            let splittedFilename = fileName.split('.');

            newFilename = splittedFilename[0] + uuid() + "." + splittedFilename[splittedFilename.length - 1];

            const uploadPath = path.join(__dirname, '..', 'uploads', newFilename);

            await thumbnail.mv(uploadPath);

            updatedPost = await Post.findByIdAndUpdate(
                postId,
                { title, category, description, thumbnail: newFilename },
                { new: true, runValidators: true }
            );

            // Delete old thumbnail after successful update
            if (oldPost.thumbnail) {
                fs.unlink(
                    path.join(__dirname, '..', 'uploads', oldPost.thumbnail),
                    (err) => {
                        if (err) console.log("Old thumbnail deletion error:", err.message);
                    }
                );
            }
        }

        if (!updatedPost) {
            return next(new HttpError("Couldn't update post.", 400));
        }

        res.status(200).json(updatedPost);

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
}






const deletePost = async (req, res, next) => {
    try {
        const postId = req.params.id;

        if (!postId) {
            return next(new HttpError("Post ID required", 400));
        }

        // Find post
        const post = await Post.findById(postId);

        if (!post) {
            return next(new HttpError("Post not found", 404));
        }

        // Check user and post creator
        console.log("Logged-in User:", req.user.id);
        console.log("Post ID:", post._id);
        console.log("Post Creator:", post.creator);

        if (post.creator.toString() === req.user.id.toString()) {

            // Delete thumbnail image
            const filePath = path.join(
                __dirname,
                '..',
                'uploads',
                post.thumbnail
            );

            try {
                await fs.promises.unlink(filePath);
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    throw error;
                }
            }

            // Delete post from database
            await Post.findByIdAndDelete(postId);

            // Update user's post count
            const currentUser = await User.findById(req.user.id);

            const userPostCount = Math.max(
                (currentUser?.posts || 0) - 1,
                0
            );

            await User.findByIdAndUpdate(req.user.id, {
                posts: userPostCount
            });

            return res.status(200).json({
                message: `Post ${postId} deleted successfully.`
            });

        } else {
            return next(
                new HttpError("Post couldn't be deleted. You are not the owner.", 403)
            );
        }

    } catch (error) {
        return next(new HttpError(error.message, 500));
    }
};


module.exports={
    createPost,
    getPosts,
    getPost,
    getCatPosts,
    getUserPosts,
    editPost,
    deletePost
}
