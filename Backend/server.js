const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fileUpload = require('express-fileupload');

app.use(fileUpload());

// Import DynamoDB configuration
const dynamoDBClient = require('./config');

const { DynamoDBDocumentClient, ScanCommand, GetCommand, PutCommand, UpdateCommand, DeleteCommand } = require('@aws-sdk/lib-dynamodb');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

const dynamoDb = DynamoDBDocumentClient.from(dynamoDBClient);

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

app.post('/upload', (req, res) => {
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send('No files were uploaded.');
  }

  const file = req.files.file;
  const formData = new FormData();
  formData.append('file', file.data, file.name);

  axios.post('https://q1ao73u6xl.execute-api.us-east-1.amazonaws.com/deploytest', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })
  .then(response => {
    console.log(response.data);
    res.send('File uploaded successfully.');
  })
  .catch(error => {
    console.error(error);
    res.status(500).send('Error uploading file.');
  });
});



// Create a new recipe
app.post('/recipes', async (req, res) => {
  const { id, title, ingredients, category } = req.body;
  console.log(ingredients)
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Item: { id, title, ingredients, category },
  };
  try {
    await dynamoDb.send(new PutCommand(params));
    res.status(201).json({ message: 'Recipe created' });
  } catch (error) {
    res.status(500).json({ error: 'Could not create recipe' });
  }
});

// Get all recipes
app.get('/recipes', async (req, res) => {
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
  };
  try {
    const data = await dynamoDb.send(new ScanCommand(params));
    res.status(200).json(data.Items);
  } catch (error) {
    res.status(500).json({ error: 'Could not load recipes' });
  }
});

// Get a single recipe by ID
app.get('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: { id },
  };
  try {
    const data = await dynamoDb.send(new GetCommand(params));
    if (data.Item) {
      res.status(200).json(data.Item);
    } else {
      res.status(404).json({ error: 'Recipe not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Could not load recipe' });
  }
});

// Update a recipe
app.put('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const { title, ingredients, category } = req.body;
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: { id },
    UpdateExpression: 'set title = :title, ingredients = :ingredients, category = :category',
    ExpressionAttributeValues: {
      ':title': title,
      ':ingredients': ingredients,
      ':category': category,
    },
    ReturnValues: 'UPDATED_NEW',
  };
  try {
    const data = await dynamoDb.send(new UpdateCommand(params));
    res.status(200).json(data.Attributes);
  } catch (error) {
    res.status(500).json({ error: 'Could not update recipe' });
  }
});

// Delete a recipe
app.delete('/recipes/:id', async (req, res) => {
  const { id } = req.params;
  const params = {
    TableName: process.env.DYNAMODB_TABLE_NAME,
    Key: { id },
  };
  try {
    await dynamoDb.send(new DeleteCommand(params));
    res.status(200).json({ message: 'Recipe deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Could not delete recipe' });
  }
});
