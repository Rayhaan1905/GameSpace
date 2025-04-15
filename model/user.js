const mongoose =require('mongoose');
const UserSchema= mongoose.Schema(
    {
        username:{
            type: String,
            required:[true,"Please Enter the Username"],
            unique:true,
            index:true
        },

        passwordHash:{
            type:String,
            required:[true,"Please enter the passwordHash"]
        }
    }
);
const User = mongoose.model("User",UserSchema);
module.exports= User;