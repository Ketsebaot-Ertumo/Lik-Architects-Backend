const {sequelize} = require('../models/index')
const DataTypes = require('sequelize')
const User = require('../models/userModel')(sequelize, DataTypes);
const { shareWithEmail} = require('../utilis/sendEmail');
const ExcelJS = require('exceljs');



//show profile
exports.showProfile = async (req, res) => {
    try{
        const user = await User.findOne({where: {email: req.user.email}, attributes: ['fullName','email','phone','role',], });
        return res.status(200).json({success: true, user});
    }catch(err){
        console.error(err);
        return res.status(500).json({success: false, message:'Failed to show ur profile.', error:err.message});
    }
    
}


//show a user
exports.aUser = async (req, res) => {
    try{
        if (!req.params.id) {
          return res.status(400).json({ message: 'Please use an id!' });
        }
        const user = await User.findOne({where: {id: req.params.id}, attributes: ['id','fullName','email','phone','role','createdAt'], });
        return res.status(200).json({success: true, user});
    }catch(err){
        console.error(err);
        return res.status(500).json({success: false, message:'Failed to show a user.', error:err.message});
    }
}




//show all users
exports.showUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      attributes: ['id','fullName','email','phone','role','createdAt'],
      order: [['createdAt', 'ASC']], 
    });

    return res.status(200).json({
      success: true,
      users,
    });
  } catch (err) {
    console.log('error occurred', err);
    return res.status(500).json({ success: false,message: 'Failed to show all users.', error: err.message });
  }
};


//user role list
exports.getRoleTypes = async (req, res) => {
  try{
      const roleNames = await User.findAll({
          attributes: [[sequelize.literal('DISTINCT "role"'), 'role']],
          raw: true,
        });
      return res.status(200).json({success: true, roleNames});
  }catch(err){
      console.error(err);
      return res.status(500).json({success: false, message:'Failed to show role list.', error:err.message});
  }  
}



exports.deleteUser = async (req, res, next) => {
    try {
      if (!req.params.id) {
        return res.status(400).json({ message: 'Please use an id!' });
      }
      const user = await User.findOne({ where: { id : req.params.id } });
      if (!user) {
        return res.status(404).json({ message: 'User not found or has been deleted before!' });
      }
      await user.destroy();
      return res.status(200).json({message: 'User deleted successfully',});
    } catch (err) {
      return res.status(500).json({success: false,message: 'Failed to delete a user', error: err.message,});
};
}


 //user profile update
 exports.update = async (req, res, next) => {
    const { id, ...updates } = req.body;
  
    try {
        if (!req.params.id) {
            return res.status(400).json({ success: false, message: 'Please use an id.' });
        }
        const user = await User.findOne({where: {id: req.params.id}});
        if(!user){
            return res.status(404).json({success:false,message: 'User not found.'});
        }
        const [updatedCount, [updatedUser]] = await User.update(updates, { where: { id:req.params.id }, returning: true });
    
        if (updatedCount === 0) {
            return res.status(404).json({ success: false, message: 'User has no update!' });
        }
  
        return res.status(200).json({ success: true, updatedUser});
    } catch (err) {
        console.log(err);
        return res.status(500).json({ success: false, message:'Server Error', error: err.message });
    }
  };



    //geerate excel for user data
    const generate = async (req, res, next) => {
        try {
          const userData = await User.findAll();
          const workbook = new ExcelJS.Workbook();
          const worksheet = workbook.addWorksheet('User Data');
          const tableHeaders = ['FullName','Email','Phone','Role'];
          worksheet.addRow(tableHeaders);
    
          for (const user of userData) {
            let rowData = [
              user.firstName,
              user.lastName ,
              user.email,
              user.phone,
              user.role ,
            ];
            worksheet.addRow(rowData);
          }
          worksheet.columns.forEach(column => {
            column.width = 15;
          });
          return workbook;
        } catch (error) {
          console.error(error);
          return res.status(500).json({success: false,message: 'Failed to generate excel to user data.',error:error.message});
        }
      };


    let fileNameCounter = '';

    //sharePDF with email
    exports.share = async (req, res) => {
    const { email } = req.body;
    try {
        if(!email ){
            return res.status(400).json({success:false, message:'Please enter email.'})
        }
        const workbook = await generate();
        const file = await workbook.xlsx.writeBuffer();
        const fileName = `User-Data-${fileNameCounter}.xlsx`;
        fileNameCounter++;
        await shareWithEmail(email, file, fileName)
        .then(() => {
            console.log('Successfully Shared.');
            res.status(200).json({success: true,message: 'Successfully Shared the file.',});
        })
    } catch (error) {
        console.error(error);
        return res.status(500).json({success: false, message:'Failed to share file with email.', error: error.message,});
    }
    };

