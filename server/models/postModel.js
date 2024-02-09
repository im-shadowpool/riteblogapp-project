const { Schema, model } = require("mongoose");

const postSchema = new Schema(
  {
    title: { type: String, required: true },
    thumbnail: { type: String, required: true },
    category: {
      type: String,
      enum: [
        "Blogging",
        "SEO",
        "Digital-Marketing",
        "On-Page SEO",
        "Off-Page SEO",
        "Youtube SEO",
        "Hosting",
        "Wordpress",
        
      ],
      message: "Value is not supported",
    },
    description: { type: String, required: true },
    creator: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = model("Post", postSchema);
