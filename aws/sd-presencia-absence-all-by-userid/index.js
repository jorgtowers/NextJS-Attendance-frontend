import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";

const ddbDocClient = DynamoDBDocumentClient.from(new DynamoDBClient({}));

export const handler = async (event) => {
    try {
        // 1. Recuperar ambos parámetros de los pathParameters
        // Configuración sugerida en Gateway: /absences/{companyId}/{userId}
        const { companyId, userId } = event.pathParameters || {};

        if (!companyId || !userId) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "CompanyId y UserId son requeridos" }),
            };
        }

        // 2. Ejecutar la consulta usando el GSI de UserId
        // Usamos KeyConditionExpression para el UserId (vía índice)
        // Usamos FilterExpression para asegurar que pertenezca a la CompanyId
        const result = await ddbDocClient.send(new QueryCommand({
            TableName: "AbsenceRequests",
            IndexName: "UserId-index", 
            KeyConditionExpression: "UserId = :u",
            FilterExpression: "CompanyId = :c",
            ExpressionAttributeValues: {
                ":u": userId,
                ":c": companyId
            },
            ScanIndexForward: false // Traer los más recientes primero
        }));

        return {
            statusCode: 200,
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*"
            },
            body: JSON.stringify(result.Items || []),
        };
    }
    catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Error al consultar ausencias", error: error.message }),
        };
    }
};