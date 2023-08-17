const express=require('express')

import todosRoutes from './routes/route'

const bodyParser=require('body-parser')

const app=express();

app.use(bodyParser.json());
app.use(todosRoutes);

app.listen(3000);