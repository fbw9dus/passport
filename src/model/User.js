
const mongoose = require('mongoose');
const { Schema } = mongoose;

const UserSchema = new Schema({
  authId:      { type:String, index:{ unique:true } },
  authData:    { type:Object },
  displayName: { type:String, required:true },
  group:       { type:Array  },
  imageURL:    { type:String },
  password:    { type:String }
});

// UserSchema.pre('save',(next)=>{ bcrypt }}

const User = mongoose.model("User", UserSchema );

module.exports = { UserSchema, User };
