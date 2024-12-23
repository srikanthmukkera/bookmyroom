const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const {City, Hotel} = require('./models');
const env = process.env.NODE_ENV || 'development';
const config = require(__dirname + '/config/config.js')[env];

const app = express();
app.use(bodyParser.json());

app.get('/api/cities', async (req, res) => {
  try {
    const cities = await City.findAll();
    res.json({success: true, data: cities});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

app.get('/api/cities/:id', async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city)
      return res.status(404).json({success: false, message: 'City not found'});
    res.json({success: true, data: city});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

app.post('/api/cities', async (req, res) => {
  try {
    const cities = await City.bulkCreate(req.body);
    res.status(201).json({success: true, data: cities});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

app.put('/api/cities/:id', async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city)
      return res.status(404).json({success: false, message: 'City not found'});
    const {name} = req.body;
    await city.update({name});
    res.json({success: true, data: city});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

app.delete('/api/cities/:id', async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city)
      return res.status(404).json({success: false, message: 'City not found'});

    await city.destroy();
    res.json({success: true, message: 'City deleted successfully'});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

app.get('/api/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.findAll({include: City});
    res.json({success: true, data: hotels});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

app.get('/api/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id, {include: City});
    if (!hotel)
      return res.status(404).json({success: false, message: 'Hotel not found'});
    res.json({success: true, data: hotel});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

app.post('/api/hotels', async (req, res) => {
  try {
    const hotels = await Hotel.bulkCreate(req.body);
    res.status(201).json({success: true, data: hotels});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

app.put('/api/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel)
      return res.status(404).json({success: false, message: 'Hotel not found'});

    const {name, cityId, rating, pricePerNight, description, numberOfGuests} =
      req.body;
    await hotel.update({
      name,
      cityId,
      rating,
      pricePerNight,
      description,
      numberOfGuests,
    });
    res.json({success: true, data: hotel});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

app.delete('/api/hotels/:id', async (req, res) => {
  try {
    const hotel = await Hotel.findByPk(req.params.id);
    if (!hotel)
      return res.status(404).json({success: false, message: 'Hotel not found'});

    await hotel.destroy();
    res.json({success: true, message: 'Hotel deleted successfully'});
  } catch (error) {
    res.status(500).json({success: false, message: error.message});
  }
});

app.post('/api/send-email', async (req, res) => {
  const {to, bookingInfo} = req.body;

  if (!to || !bookingInfo) {
    return res
      .status(400)
      .json({error: 'Please provide to and bookingInfo fields'});
  }

  try {
    const htmlTemplate = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Booking Confirmation</h2>
                <p>Dear Customer,</p>
                <p>Thank you for your booking! Here are your details:</p>
                <table border="1" style="border-collapse: collapse; width: 100%; margin-top: 10px;">
                    <tr>
                        <th style="padding: 8px; text-align: left;">Field</th>
                        <th style="padding: 8px; text-align: left;">Value</th>
                    </tr>
                    ${Object.entries(bookingInfo)
                      .map(
                        ([key, value]) => `
                        <tr>
                            <td style="padding: 8px;">${key}</td>
                            <td style="padding: 8px;">${value}</td>
                        </tr>`,
                      )
                      .join('')}
                </table>
                <p></p>
                <p>Best regards,<br>Book My Room</p>
            </div>
        `;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'srikanthmukkera96@gmail.com',
        pass:
          config?.email_password?.split(' ')?.length > 2
            ? config?.email_password
            : 'cnhq gzlq eqsg hbix',
      },
    });

    const mailOptions = {
      from: 'srikanthmukkera96@gmail.com',
      to: to,
      subject: 'Booking Confirmation - Your Booking Info',
      html: htmlTemplate,
    };

    const info = await transporter.sendMail(mailOptions);

    res.status(200).json({
      message: 'Email sent successfully',
      info: info,
    });
  } catch (error) {
    console.error('Error sending email:', error);
    res
      .status(500)
      .json({error: 'Failed to send email', details: error.message});
  }
});

// Start server
const PORT = 3000;
app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`),
);
