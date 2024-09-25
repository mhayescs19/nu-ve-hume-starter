import { HumeClient } from "hume";

export const createNotificationTool = async () => {
    const client  = new HumeClient({apiKey: process.env.HUME_API_KEY});

    const toolCount = await client.empathicVoice.tools.listTools();

    var toolExists = false;

    // check for existance of create notification tool
    toolCount.data.forEach((tool) => {
        const currentTool = tool as {
            name: string;
        };

        if (currentTool.name === "create_notification") {
            toolExists = true;
        }
    });

    if (!toolExists) {
        const parameters = { // define function format with JSON and descriptions to aid EVI
            "type": "object",
            "required": ["date", "time", "message"],
            "properties": {
              "date": {
                "type": "string",
                "description": "Based on the user's request, and ask if you need to clarify the date, format the date into YYYY-MM-DD format."
              },
              "time": {
                "type": "string",
                "description": "Based on the user's request, and ask if you need to clarify the time, format the time into HH:MM format."
              },
              "message": {
                "type": "string",
                "description": "Create a summary of the users request. Include an action item or the action items in the reminder notification. Use a friendly tone and start with \"Hi, Nu-Ve here\""
              }
            }
          }
    
        const parametersStringify = JSON.stringify(parameters);
    
        await client.empathicVoice.tools.createTool({
            name: "create_notification",
            parameters: parametersStringify
        });
    }
}


  