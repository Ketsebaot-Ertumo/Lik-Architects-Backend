
const {sequelize} = require('../models/index')
const DataTypes = require('sequelize')
const User = require('../models/userModel')(sequelize, DataTypes);
const jwt= require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const {generateConfirmationCode, generateToken} = require('../utilis/generateCode');
const {sendConfirmationEmail, sendPasswordResetEmail, sendConfResetEmail, sendWelcomeEmail} = require('../utilis/sendEmail');






//user sign up
exports.signup = async (req, res, next) => {
  const{ email, fullName, password, phone  } = req.body;
    try{
      if (!fullName || !email ||!password){
        return res.status(403).json({success: false,message: 'Please add user detail.' });
      }
        const userExist = await User.findOne({ where: { email: email.toLowerCase()} });
        if (userExist){
            return res.status(406).json({success: false,message: "E-mail already registered" });
        }
        const confirmationCode = generateConfirmationCode();
        const user =await User.create(req.body);
        // const user =await User.create({email, firstName, lastName, password, phone});
        user.confirmationCode = generateConfirmationCode();
        await user.save();
        await sendConfirmationEmail(user.email, confirmationCode, user.fullName);
        res.status(201).json({success: true,message: 'Please confirm/verify your email.',user:{email:user.email, code: user.confirmationCode} }); 
    }catch (error){
      console.log(error);
      return res.status(500).json({success: false, message: error.message, stack: error.stack });
    }
}


exports.confirm = async (req, res) => {
  const { confirmationCode } = req.body;
  const token = req.cookies.token;
    try {
      if (!confirmationCode) {
        return res.status(400).json({success: false,message: "Please use a confirmationCode!" });
      }
      const user = await User.findOne({where:{ confirmationCode }});
      if (!user) {
        return res.status(306).json({success: false,message: "Invalid confirmation code/ Already confirmed!" });
      }
      user.confirmationCode = 'Confirmed';
      await user.save();
      await sendWelcomeEmail(user.email, user.fullName, 'system user');

      sendTokenResponse(user, 200, res);
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message: error.message, stack: error.stack });
    }
  };



//user signin
exports.signin = async (req, res, next) => {
    try{
        const {email, password} = req.body;
        const token = req.cookies.token;
        if (!email){
            return res.status(403).json({success: false,message: "Please add an email." });
        }
        if (!password){
            return res.status(403).json({success: false,message: "Please add a password." });
        }
        const user = await User.findOne({where:{email:email.toLowerCase()}});
        if (!user){
            return res.status(306).json({success: false,message: "Invalid credential." });
          }
        const isMatched = await user.comparePassword(password);
        if(!isMatched){
            return res.status(306).json({success: false, message: "Invalid credential." });
        }
        sendTokenResponse(user, 200, res);
    }
    catch (error){
        console.error(error);
        return res.status(500).json({success: false, message: error.message, stack: error.stack });
    }
}


//logout
exports.logout = async (req, res, next) => {
  try{
    const token = req.cookies.token;
    if(!token){
      return res.status(401).json({success: false,message: "You're alrady signed out!" })
    }
    res.clearCookie('token');
    res.status(200).json({success: true,message: "Logged out Successfully." })
}catch(err){
  console.error(err);
}
}


//user forgot password
exports.forgot = async (req, res, next) => {
        const {email} = req.body;
        try {
          if(!email){
            return res.status(403).json({success: false,message: "Please add email." });
          }
          const user = await User.findOne({where:{ email:email.toLowerCase()} });
          if (!user) {
            return res.status(404).json({success: false,message: "User not found" });
          }
          const resetToken = generateToken();
          user.resetToken = resetToken;

          await user.save();
          const resetLink1 =`https://lik.architects.com/password/reset/${resetToken}`;
          const resetLink2 =`http://localhost:3000/password/reset/${resetToken}`;
          await sendPasswordResetEmail(user.email, resetLink1, resetLink2, user.fullName);
          res.status(200).json({success: true,message: 'Password Reset email sent, Please check your email.',resetToken,resetLink1, resetLink2});
          } catch (error) {
            console.log(error)
            return res.status(500).json({success: false, message: error.message, stack: error.stack });
          }
      }


    // user reset password
    exports.reset = async (req, res) => {
        const { newPassword,resetToken} = req.body;
        if(!newPassword || !resetToken){
          return res.status(400).json({success: false, message: 'Please use a new password and/or resetToken.' });
        }
        try {
          const decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
          const user = await User.findOne({ where: { resetToken }});
          if (!user) {
            return res.status(401).json({success: false, message: 'User not found' });
          }
          const isMatched = await user.comparePassword(newPassword);
          if(isMatched){
              return res.status(401).json({success: false,message: "Please enter a new password." });
          }
            // const hashedPassword = await bcryptjs.hash(newPassword, 10);
            user.password = await bcryptjs.hash(newPassword, 10);
            user.resetToken = "Reseted";
            await user.save();
            await sendConfResetEmail(user.email, user.fullName);
            res.status(200).json({ success: true, message: 'Password reset successfully'});
          } catch (error) {
            console.log(err)
            return res.status(500).json({success: false,message:'Please Reset password again!', error: error.message });
          }
    }



    const sendTokenResponse = async (user, codeStatus, res)=>{
        const token = await user.getJwtToken();
        res
          .status(codeStatus)
          // .cookie('token', token, { maxAge: 8 * 60 * 60 * 1000, httpOnly: true, secure: true, domain: 'yourdomain.com', path: '/' })
          .cookie('token', token, {maxAge: 8 * 60 * 60 * 1000,  secure: false})
            .json({
                success: true,
                id: user.id,
                role: user.role,
                token: token,    
            });
    }
