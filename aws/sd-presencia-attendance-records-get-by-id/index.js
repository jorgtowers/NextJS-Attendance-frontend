import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event) => {
    try {
        const { id } = event.pathParameters || {}; // Este es el UserId

        if (!id) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "UserId es requerido" }),
            };
        }

        // Usamos QueryCommand para buscar por UserId
        const result = await ddbDocClient.send(new QueryCommand({
            TableName: "AttendanceRecords",
            // Si creaste un GSI para UserId, pon su nombre aquí. 
            // Si UserId es tu Partition Key de la tabla, quita la línea de IndexName.
            IndexName: "UserId-index", 
            KeyConditionExpression: "UserId = :userId",
            // Filtramos para obtener solo los que NO tienen CheckOut (están en null)
            FilterExpression: "attribute_not_exists(CheckOut) OR CheckOut = :nullValue",
            ExpressionAttributeValues: {
                ":userId": id,
                ":nullValue": null
            }
        }));

        // Validar si encontramos un registro abierto
        if (!result.Items || result.Items.length === 0) {
            return {
                statusCode: 404,
                body: JSON.stringify({ message: "No se encontró un registro de asistencia abierto para este usuario" }),
            };
        }

        // Retornamos el primer registro abierto encontrado (el más reciente)
        return {
            statusCode: 200,
            body: JSON.stringify(result.Items[0]),
        };
    }
    catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: error.message }),
        };
    }
};