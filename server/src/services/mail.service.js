import nodemailer from 'nodemailer';

function sendEmail(to, cc = [], bcc = [], subject = '', text = '', html = '') {

    var transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user:"prajapatihemantmotivation@gmail.com",
            pass: "ozfo mcpj zfvh ezuz"
        },
        secure: true,
    });

    const ccList = Array.isArray(cc) ? cc.join(',') : cc;
    const mailOptions = {
        from: 'ajayji123gole@gmail.com', //company email
        to: to.to,
        cc: ccList,
        bcc: bcc,
        subject: subject,
        text: to.text,
        html: html,
    };

    return new Promise((resolve, reject) => {
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                return console.log('ERROR : services > mail.service > sendMail : ', error);
                return resolve(false)
            }
            console.log('services > Mail.services :Message sent', info.messageId);
            return resolve(true)
        });
    })



}

export default sendEmail;


