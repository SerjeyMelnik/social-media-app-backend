import nodemailer from "nodemailer"

class MailService {


	async sendActivationMail(to, link) {

		const transporter = nodemailer.createTransport(
			{
				host: process.env.SMTP_HOST, //smtp.gmail.com
				port: process.env.SMTP_PORT, //465
				service: "gmail",
				auth: {
					user: process.env.SMTP_USER, // user: 'mailt4268@gmail.com',
					pass: process.env.SMTP_PASSWORD // pass: 'edwcphtptyozuvqj'
				}
			}
		)

		transporter.sendMail({
			from: process.env.SMTP_USER,
			to: to,
			subject: "Account activation on " + process.env.API_URL,
			html:
				`
					<div >
						<h1>For account activation press this button</h1>
						<a href='${link}' style='
						display: block;
						background: #3D5CFF;
						color: white;
						width: fit-content;
						box-sizing: border-box;
						padding: 10px 20px;
						border-radius: 10px;
						font-size: 18px;
						margin: auto;
						font-weight: 600;
						text-decoration:none;
						'>ACTIVATE</a>
					</div>
				`
		}, (err, data) => {
			if (err) {
				console.log(err);
			} else {
				console.log('Email sent successfully');
			}
		})
	}
}

export default new MailService()