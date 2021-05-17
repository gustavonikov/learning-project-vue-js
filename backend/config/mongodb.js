const mongoose = require('mongoose')

mongoose
    .connect('mongodb://localhost/wm-backend', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(error => {
        const message = 'The server was unable to connect with MongoDB'

        console.log('\x1b[41m%s\x1b[37m', message, '\x1b[0m')
    })