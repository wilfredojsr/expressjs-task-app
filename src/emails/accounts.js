const sgMail = require('@sendgrid/mail')
const sendgridAPpKey = process.env.SEND_GRID_KEY

const sendWelcomEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: process.env.SEND_GRID_FROM_EMAIL,
    subject: 'Thanks for joining in!',
    html: `Welcome to the app, ${name}. Let me know you get along with app.`
  })
}

const sendCancelationEmail = (email, name) => {
  sgMail.send({
    to: email,
    from: process.env.SEND_GRID_FROM_EMAIL,
    subject: 'Sorry to see you go!',
    html: `Goodbye ${name} I hope to see you back sometime soon.`
  })
}

module.exports = {
  sendWelcomEmail,
  sendCancelationEmail
}