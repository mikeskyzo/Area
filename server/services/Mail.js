var nodemailer = require('nodemailer');

exports.is_service_active = async function (user_id)
{
	return true;
}

exports.send_message = async function (area, res)
{
	let email = global.getParam(area.reaction.params, 'email');
	let message = global.getParam(area.reaction.params, 'message');

	if (!email || !message) {
		global.responseError(res, 401, 'Missing email or a message')
	  	return;
  	}

	var transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false,
		requireTLS: true,
		auth: {
			user: 'areacoon@gmail.com',
			pass: 'Areacoon123'
		}
	});

    var mailOptions = {
        from: 'gerard.reat@gmail.com',
        to : email,
        subject: 'Areacoon',
        text: message
    };

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
        	console.log(error);
			res.send();
        } else {
			res.send();
			console.log('Email sent: ' + info.response);
        }
    });
}

exports.send_message_check_args = function(json)
{
    if (!global.getParam(json.reaction.params, 'email'))
		return 'Missing a email';
    else if (!global.getParam(json.reaction.params, 'message'))
		return 'Missing a message to send';
    else
		return null;
}
