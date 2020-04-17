const nodemailer=require('nodemailer');

const sendEmail= async options=>{
    //1) define a transpoter
    const transpoter=nodemailer.createTransport({
       host:process.env.EMAIL_HOST,
       auth:{
           user:process.env.EMAIL_USERNAME,
           pass:process.env.EMAIL_PASSWORD
       }
    });

    //2) define the mail Options
    const mailOptions={
        from:'Poojan Savani',
        to:options.email,
        subject:options.subject,
        text:options.message
    }
    transpoter.sendMail(mailOptions)
}
module.exports=sendEmail;