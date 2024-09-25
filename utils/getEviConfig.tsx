export const getEviConfig = async () => {
    const apiKey = String(process.env.HUME_API_KEY);

    // First, try to create a new configuration
    const createResponse = await fetch('https://api.hume.ai/v0/evi/configs', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-Hume-Api-Key': apiKey,
        },
        body: JSON.stringify({
            name: "doctor-prompt",
            evi_version: "2",
            "language_model": {
                "model_provider": "ANTHROPIC",
                "model_resource": "claude-3-haiku-20240307", // recommended model for tool use as EVI-2 is not supported when using tools
                "temperature": 1
            },
            voice: {
                provider: "HUME_AI",
                name: "ITO"
            },
            // todo: add eLLM config
            prompt: {
                text: "Assume of the role of an endocrinologist named Dr. Luna. You are giving advice on how to manage my weight. Please start by asking me a few questions about how I am doing with following the treatment plan that was given to me: 1) eat three well spread out meals, 2) walk in the mornings daily, 3) yoga at night."
            }
        })
    });

    if (createResponse.status === 409) {
        // If creation fails due to conflict, try to fetch existing configurations
        const getResponse = await fetch('https://api.hume.ai/v0/evi/configs', {
            method: 'GET',
            headers: {
                'X-Hume-Api-Key': apiKey,
            }
        });

        if (!getResponse.ok) {
            throw new Error(`HTTP error! status: ${getResponse.status}`);
        }

        const configs = await getResponse.json(); // known format from api docs = {configs_page: [configObjs]}
        console.log("API response:", configs, null, 2);

        const configsArray = configs.configs_page // must parse configs page

        const existingConfig = configsArray.find((config: any) => config.name === "doctor-prompt"); // lambda function to find doctor prompt config

        if (!existingConfig) {
            throw new Error("Couldn't create new config or find existing one");
        }

        return existingConfig;
    }

    if (!createResponse.ok) {
        throw new Error(`HTTP error! status: ${createResponse.status}`);
    }

    const config = await createResponse.json(); // convert new config details to json
    return config;
}