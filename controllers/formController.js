
const { sendFormWithEmail } = require('../utilis/sendEmail');


//form sending
exports.formSubmission = async (req, res, next) => {

    const{ formData  } = req.body;
    const {email} = process.env;

    try{

        if (!formData){
            return res.status(403).json({success: false,message: 'Please add form data.' });
        }

        // Extract values from formData object
        const formValues = Object.entries(formData);
        await sendFormWithEmail(email, formValues);

        return res.status(200).json({success: true,formValues ,message: `Successfully sent form data to email: ${email} .`}); 
    }catch (error){
      console.log(error);
      return res.status(500).json({success: false, message: error.message, stack: error.stack });
    }
}

