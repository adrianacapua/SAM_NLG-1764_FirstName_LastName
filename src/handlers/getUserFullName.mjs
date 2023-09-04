// Create clients and set shared const values outside of the handler.

// Create a DocumentClient that represents the query to add an item
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand } from '@aws-sdk/lib-dynamodb';
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.USER_TABLE;

/**
 * A simple example includes a HTTP get method to get one user by passing firstName as query params from a DynamoDB table.
 */
export const getUserFullNameHandler = async (event) => {
  if (event.httpMethod !== 'GET') {
    throw new Error(`getMethod only accept GET method, you tried: ${event.httpMethod}`);
  }
  console.info('received:', event);

  if (!event.queryStringParameters.firstName) {
    const response = {
      statusCode: 400,
      message: "Bad Request",
    };

    return response;
  }

  const firstName = event.queryStringParameters.firstName;
  const params = {
    TableName : tableName,
    Key: { firstName: firstName },
  };

  let fullName = "";

  try {
    const data = await ddbDocClient.send(new GetCommand(params));

    console.log(data.Item);

    if (data.Item.firstName && data.Item.lastName) {
      fullName = `${data.Item.firstName} ${data.Item.lastName}`
    }

  } catch (err) {
    console.log("Error", err);
  }
 
  const response = {
    statusCode: 200,
    body: JSON.stringify({ fullName })
  };
 
  console.info(`response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
