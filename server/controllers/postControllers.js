const Post = require("../models/postModel");
const User = require("../models/userModel");
const path = require("path");
const fs = require("fs");
const { v4: uuid } = require("uuid");
const ErrorHttp = require("../models/modelError");

///////////////////`````````````````Create Post```````````````````////////////////////////
// POST: api/posts/ //create-post
// PROTECTED
const createPost = async (req, res, next) => {
  try {
    const { title, category, description } = req.body;
    if (!title || !category || !description || !req.files) {
      return next(new ErrorHttp("Fill in the All Blanks", 422));
    }
    const { thumbnail } = req.files; //Why Thubnail
    if (thumbnail.size > 2000000) {
      return next(new ErrorHttp("Thumbnail is too big, try below 2mb", 422));
    }
    let fileName = thumbnail.name;
    let splittedFileName = fileName.split(".");
    let newFileName =
      splittedFileName[0] +
      uuid() +
      "." +
      splittedFileName[splittedFileName.length - 1];

    thumbnail.mv(
      path.join(__dirname, "..", "/uploads", newFileName),
      async (err) => {
        if (err) {
          return next(new ErrorHttp("Error in mv", 422));
        }
      }
    );
    const newPost = await Post.create({
      title,
      category,
      description,
      thumbnail: newFileName,
      creator: req.user.id,
    });
    if (!newPost) {
      return next(new ErrorHttp("Couldnt be created", 422));
    }
    const currentUser = await User.findById(req.user.id);
    const userPostCount = currentUser.posts + 1;
    await User.findByIdAndUpdate(req.user.id, { posts: userPostCount });
    res.status(201).json(newPost);
  } catch (error) {
    return next(new ErrorHttp(error, 422));
  }
};

///////////////////`````````````````Get Post```````````````````////////////////////////
// GET: api/posts/
// UNPROTECTED
const getPosts = async (req, res, next) => {
  try {
    const Posts = await Post.find().sort({ updatedAt: -1 });
    res.status(201).json(Posts);
  } catch (error) {
    return next(new ErrorHttp(error, 422));
  }
};

///////////////////`````````````````Get Single Post```````````````````////////////////////////
// GET: api/posts/:id
// UNPROTECTED
const singlePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      return next(new ErrorHttp("Post not found", 422));
    }
    res.status(201).json(post);
  } catch (error) {
    return next(new ErrorHttp(error, 422));
  }
};

///////////////////`````````````````Get Posts by Category```````````````````////////////////////////
// GET: api/posts/categories/:categoty
// UNPROTECTED
const postsByCategory = async (req, res, next) => {
  try {
    const category = req.params.category;
    const postsCat = await Post.find({ category: category }).sort({
      updatedAt: -1,
    });
    res.status(200).json(postsCat);
  } catch (error) {
    return next(new ErrorHttp(error, 422));
  }
};

///////////////////`````````````````Get posts by Author```````````````````////////////////////////
// GET: api/posts/users/:id
// UNPROTECTED
const postsByAuthor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const postsAuth = await Post.find({ creator: id }).sort({ updatedAt: -1 });
    res.status(202).json(postsAuth);
  } catch (error) {
    return next(new ErrorHttp(error, 422));
  }
};

///////////////////`````````````````Edit Post```````````````````////////////////////////
// POST: api/posts/:id
// PROTECTED
const editPost = async (req, res, next) => {
  try {
    let fileName;
    let newFileName;
    let updatedPost;

    const postId = req.params.id;
    let { title, category, description } = req.body;
    //ReactQuill has a paragraph opening and closing tag with a break tag in between so there are 11 characters in there already
    if (!title || !category || description < 12) {
      return next(new ErrorHttp("Fill in all fields", 422));
    }
    const oldPost = await Post.findById(postId);

    if (req.user.id == oldPost.creator) {
      if (!req.files) {
        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { title, category, description },
          { new: true }
        );
      } else {
        //delete the old thumbnail
        fs.unlink(
          path.join(__dirname, "..", "uploads", oldPost.thumbnail),
          async (err) => {
            if (err) {
              return next(new ErrorHttp(err));
            }
          }
        );
        const { thumbnail } = req.files;
        if (thumbnail.size > 2000000) {
          return next(new ErrorHttp("Thumbnail is too big, try below 2mb"));
        }
        fileName = thumbnail.name;
        let splittedFileName = fileName.split(".");
        newFileName =
          splittedFileName[0] +
          uuid() +
          "." +
          splittedFileName[splittedFileName.length - 1];
        thumbnail.mv(
          path.join(__dirname, "..", "uploads", newFileName),
          async (err) => {
            if (err) {
              return next(new ErrorHttp(err));
            }
          }
        );
        updatedPost = await Post.findByIdAndUpdate(
          postId,
          { title, category, description, thumbnail: newFileName },
          { new: true }
        );
      }
    }

    if (!updatedPost) {
      return next(new ErrorHttp("Couldnt update post", 400));
    }

    res.status(200).json(updatedPost);
  } catch (error) {
    return next(new ErrorHttp(error, 422));
  }
};

///////////////////`````````````````Delete Post```````````````````////////////////////////
// POST: api/posts/:id
// PROTECTED
const postDelete = async (req, res, next) => {
  try {
    const postId = req.params.id;
    // const currentUser = req.user.id;
    if (!postId) {
      return next(new ErrorHttp("Post unable to delete", 422));
    }

    const post = await Post.findById(postId);
    const fileName = post?.thumbnail;
    if (req.user.id == post.creator) {
      fs.unlink(
        path.join(__dirname, "..", "/uploads", fileName),
        async (err) => {
          if (err) {
            return next(new ErrorHttp(err, 422));
          } else {
            await Post.findByIdAndDelete(postId);

            const currentUser = await User.findById(req.user.id);
            // console.log(newCuurentUser);
            const userPostCount = currentUser?.posts - 1;
            // console.log(userPostCount);

            await User.findByIdAndUpdate(currentUser, { posts: userPostCount });
            res.json(`Post ${postId} deleted Successfully`);
          }
        }
      );
    } else {
      return next(new ErrorHttp("Post could not be deleted", 403));
    }
  } catch (error) {
    return next(new ErrorHttp(error));
  }
};

module.exports = {
  createPost,
  editPost,
  postDelete,
  postsByAuthor,
  postsByCategory,
  singlePost,
  getPosts,
};
