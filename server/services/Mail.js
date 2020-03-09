var nodemailer = require('nodemailer');

exports.is_service_active = async function (user_id)
{
	return true;
}

exports.send_message = async function (area)
{
	let email = global.getParam(area.reaction.params, 'email');
	let message = global.getParam(area.reaction.params, 'message');

	if (!email || !message)
		return 'Missing email or a message'

	var transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		requireTLS: true,
		auth: {
			user: process.env.GMAIL_USERNAME,
			pass: process.env.GMAIL_PASS
		}
	});

    var mailOptions = {
        from: 'gerard.reat@gmail.com',
        to : email,
        subject: 'Areacoon',
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error)
			return 'Something went wrong with the send of email';
    });
}

exports.send_message_check_args = function(json)
{
    if (!global.getParam(json.reaction.params, 'email'))
		return 'Missing a email';
    else if (!global.getParam(json.reaction.params, 'message'))
		return 'Missing a message to send';
}
