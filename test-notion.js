require('dotenv').config({ path: '.env.test' });
const { Client } = require('@notionhq/client');

const notion = new Client({
  auth: process.env.NOTION_API_KEY
});

async function testConnection() {
  try {
    console.log('Token:', process.env.NOTION_API_KEY);
    console.log('Database ID:', process.env.NOTION_DATABASE_ID);
    
    const response = await notion.databases.retrieve({
      database_id: process.env.NOTION_DATABASE_ID
    });
    
    console.log('Conexión exitosa!');
    console.log('Database title:', response.title);
  } catch (error) {
    console.error('Error:', error.message);
    console.error('Code:', error.code);
    if (error.status) {
      console.error('Status:', error.status);
    }
  }
}

testConnection();
