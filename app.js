const bodyParser = require('body-parser');

const StudentRoutes = require('./routes/auth.routes');
const TeacherRoutes = require('./routes/teacher.routes');
const FileRoutes = require('./routes/file.routes');

const express = require('express');
const app = express();
const cors = require('cors');

app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Serve static resources
app.use('/public', express.static('public'));
app.use(cors());

app.use('/', FileRoutes);
app.use('/api', StudentRoutes);
app.use('/api/teacher', TeacherRoutes);

const portNumber = process.env.PORT || 3400;
app.listen(portNumber, () =>
    console.log('Server connected on port ' + portNumber
));
