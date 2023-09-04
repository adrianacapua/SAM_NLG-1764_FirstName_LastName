import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
const client = new DynamoDBClient({});
const ddbDocClient = DynamoDBDocumentClient.from(client);

// Get the DynamoDB table name from environment variables
const tableName = process.env.USER_TABLE;

/**
 * A simple example includes a HTTP post method to add one user to a DynamoDB table.
 */
export const putUserNameHandler = async (event) => {
  if (event.httpMethod !== "POST") {
    throw new Error(
      `postMethod only accepts POST method, you tried: ${event.httpMethod} method.`
    );
  }
  console.info("received:", event);

  if (!event.body) {
    const response = {
      statusCode: 400,
      message: "Bad Request",
    };

    return response;
  }

  // Get firstName and lastName from the body of the request
  const body = JSON.parse(event.body);
  const firstName = body.firstName;
  const lastName = body.lastName;

  const params = {
    TableName: tableName,
    Item: { firstName: firstName, lastName: lastName },
  };

  try {
    const data = await ddbDocClient.send(new PutCommand(params));
    console.log("Success - item added or updated", data);
  } catch (err) {
    console.log("Error", err.stack);
  }

  const response = {
    statusCode: 200,
    body: JSON.stringify(body),
  };

  console.info(
    `response from: ${event.path} statusCode: ${response.statusCode} body: ${response.body}`
  );
  return response;
};
