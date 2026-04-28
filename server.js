// ============================================
// SMART RESTAURANT AI ASSISTANT - BACKEND
// Using Google Gemini API for AI Processing
// ============================================

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { ChatOpenAI } from '@langchain/openai';
import { tool } from '@langchain/core/tools';
import { z } from 'zod';
import { HumanMessage, AIMessage, SystemMessage } from '@langchain/core/messages';


dotenv.config();


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));


const restaurantData = {
    menus: {
        breakfast: {
            items: [
                { name: "Aloo Paratha", price: 80, description: "Stuffed potato flatbread with butter" },
                { name: "Poha", price: 50, description: "Flattened rice with peanuts and spices" },
                { name: "Masala Chai", price: 30, description: "Spiced Indian tea" },
                { name: "Idli Sambar", price: 60, description: "Steamed rice cakes with lentil soup" },
                { name: "Omelette", price: 45, description: "Fluffy egg omelette with vegetables" }
            ],
            timing: "7:00 AM - 11:00 AM"
        },
        lunch: {
            items: [
                { name: "Paneer Butter Masala", price: 180, description: "Cottage cheese in creamy tomato gravy" },
                { name: "Dal Fry", price: 120, description: "Tempered yellow lentils" },
                { name: "Jeera Rice", price: 80, description: "Cumin flavored basmati rice" },
                { name: "Tandoori Roti", price: 20, description: "Clay oven baked bread" },
                { name: "Mixed Veg Curry", price: 150, description: "Seasonal vegetables in spiced gravy" }
            ],
            timing: "12:00 PM - 4:00 PM"
        },
        dinner: {
            items: [
                { name: "Veg Biryani", price: 200, description: "Fragrant rice with vegetables and spices" },
                { name: "Raita", price: 40, description: "Yogurt with cucumber and spices" },
                { name: "Gulab Jamun", price: 60, description: "Sweet milk dumplings in sugar syrup" },
                { name: "Butter Naan", price: 35, description: "Soft leavened bread with butter" },
                { name: "Malai Kofta", price: 190, description: "Fried paneer balls in creamy sauce" }
            ],
            timing: "7:00 PM - 11:00 PM"
        }
    },
    restaurantInfo: {
        name: "Spice Garden Restaurant",
        location: "123 Food Street, Lahore,Hafizabad",
        phone: "+92-00000000",
        rating: "4.5/5 stars"
    }
};




const getMenuTool = tool(
    async ({ category }) => {
        console.log(`\n🔧 [TOOL CALLED] get_menu with category: ${category}`);
        
        const normalizedCategory = category.toLowerCase().trim();
        const menu = restaurantData.menus[normalizedCategory];
        
        if (!menu) {
            return `Sorry, we don't have a menu for "${category}". Please choose from: breakfast, lunch, or dinner.`;
        }
        
        let response = `📋 ${normalizedCategory.toUpperCase()} MENU\n`;
        response += `⏰ Timing: ${menu.timing}\n\n`;
        
        menu.items.forEach((item, index) => {
            response += `${index + 1}. ${item.name} - Rs.${item.price}\n`;
            response += `   ${item.description}\n\n`;
        });
        
        return response;
    },
    {
        name: "get_menu",
        description: "Get the restaurant menu for breakfast, lunch, or dinner. Use this when user asks about food items, menu, or what is available to eat.",
        schema: z.object({
            category: z.string().describe("The meal category: 'breakfast', 'lunch', or 'dinner'")
        })
    }
);


const searchDishTool = tool(
    async ({ dishName }) => {
        console.log(`\n🔧 [TOOL CALLED] search_dish for: ${dishName}`);
        
        const searchTerm = dishName.toLowerCase();
        let foundItems = [];
        
        for (const [mealType, menu] of Object.entries(restaurantData.menus)) {
            for (const item of menu.items) {
                if (item.name.toLowerCase().includes(searchTerm)) {
                    foundItems.push({
                        ...item,
                        mealType,
                        timing: menu.timing
                    });
                }
            }
        }
        
        if (foundItems.length === 0) {
            return `Sorry, "${dishName}" is not on our menu. Try asking about breakfast, lunch, or dinner options.`;
        }
        
        let response = `🔍 Found ${foundItems.length} result(s) for "${dishName}":\n\n`;
        foundItems.forEach(item => {
            response += `• ${item.name} - Rs.${item.price}\n`;
            response += `  ${item.description}\n`;
            response += `  Available: ${item.mealType.toUpperCase()} (${item.timing})\n\n`;
        });
        
        return response;
    },
    {
        name: "search_dish",
        description: "Search for a specific dish by name to check if it's available and get its price and details.",
        schema: z.object({
            dishName: z.string().describe("The name of the dish to search for")
        })
    }
);


const getRestaurantInfoTool = tool(
    async ({ infoType }) => {
        console.log(`\n🔧 [TOOL CALLED] get_restaurant_info for: ${infoType}`);
        
        const info = restaurantData.restaurantInfo;
        const type = infoType.toLowerCase();
        
        switch (type) {
            case 'location':
                return `📍 Location: ${info.location}`;
            case 'contact':
                return `📞 Contact: ${info.phone}`;
            case 'rating':
                return `⭐ Rating: ${info.rating}`;
            default:
                return `🍽️ ${info.name}\n📍 ${info.location}\n📞 ${info.phone}\n⭐ ${info.rating}`;
        }
    },
    {
        name: "get_restaurant_info",
        description: "Get restaurant information like location, contact number, or ratings.",
        schema: z.object({
            infoType: z.string().describe("Type of info: 'all', 'location', 'contact', or 'rating'")
        })
    }
);


const getPriceRangeTool = tool(
    async ({ category }) => {
        console.log(`\n🔧 [TOOL CALLED] get_price_range for: ${category}`);
        
        const menu = restaurantData.menus[category.toLowerCase()];
        
        if (!menu) {
            return `Invalid category. Choose: breakfast, lunch, or dinner.`;
        }
        
        const prices = menu.items.map(item => item.price);
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const avgPrice = Math.round(prices.reduce((a, b) => a + b, 0) / prices.length);
        
        return `💰 ${category.toUpperCase()} Prices:\n• Minimum: Rs.${minPrice}\n• Maximum: Rs.${maxPrice}\n• Average: Rs.${avgPrice}`;
    },
    {
        name: "get_price_range",
        description: "Get the price range for a meal category.",
        schema: z.object({
            category: z.string().describe("The meal category: 'breakfast', 'lunch', or 'dinner'")
        })
    }
);


const tools = [getMenuTool, searchDishTool, getRestaurantInfoTool, getPriceRangeTool];


const toolsMap = {
    get_menu: getMenuTool,
    search_dish: searchDishTool,
    get_restaurant_info: getRestaurantInfoTool,
    get_price_range: getPriceRangeTool
};



const geminiModel = new ChatOpenAI({
    modelName: "nex-agi/deepseek-v3.1-nex-n1:free",
    temperature: 0.3,
    openAIApiKey: process.env.GOOGLE_API_KEY,
    configuration: {
        baseURL: "https://openrouter.ai/api/v1",
    }
});

// Bind tools to the model
const modelWithTools = geminiModel.bindTools(tools);

// System prompt
const systemPrompt = `You are a friendly AI assistant for "Spice Garden Restaurant", an Pakistani restaurant.

Your job:
1. Help customers view menus (breakfast, lunch, dinner)
2. Search for specific dishes
3. Provide restaurant info (location, contact, ratings)
4. Give price information

Rules:
- Be polite and helpful
- Use the available tools to get accurate information
- Only answer restaurant-related questions
- If asked about non-restaurant topics, politely say you can only help with restaurant queries
- You are not an Claude or Any other model You are current resturent or hotel name bot e.g (Hotel Name) + Assisstant

Available tools:
- get_menu: Get menu for breakfast, lunch, or dinner
- search_dish: Search for a specific dish
- get_restaurant_info: Get location, contact, rating info
- get_price_range: Get price range for a meal category`;



async function runAgent(userMessage) {
    console.log('\n' + '='.repeat(50));
    console.log(`📩 User: ${userMessage}`);
    console.log('🤖 Processing with Gemini...');
    console.log('='.repeat(50));

    const messages = [
        new SystemMessage(systemPrompt),
        new HumanMessage(userMessage)
    ];

    let iterations = 0;
    const maxIterations = 3;

    while (iterations < maxIterations) {
        iterations++;
        console.log(`\n🔄 Iteration ${iterations}/${maxIterations}`);

        const response = await modelWithTools.invoke(messages);
        
        if (response.tool_calls && response.tool_calls.length > 0) {
            console.log(`\n🛠️ Model requested ${response.tool_calls.length} tool(s)`);
            
            messages.push(response);

            for (const toolCall of response.tool_calls) {
                const toolName = toolCall.name;
                const toolArgs = toolCall.args;
                
                console.log(`   → Calling: ${toolName} with args:`, toolArgs);

                const toolToUse = toolsMap[toolName];
                
                if (toolToUse) {
                    try {
                        const toolResult = await toolToUse.invoke(toolArgs);
                        console.log(`   Tool result received`);
                        
                        // Add tool result to messages
                        messages.push({
                            role: "tool",
                            content: toolResult,
                            tool_call_id: toolCall.id
                        });
                    } catch (error) {
                        console.log(`    Tool error: ${error.message}`);
                        messages.push({
                            role: "tool",
                            content: `Error: ${error.message}`,
                            tool_call_id: toolCall.id
                        });
                    }
                } else {
                    messages.push({
                        role: "tool",
                        content: `Tool ${toolName} not found`,
                        tool_call_id: toolCall.id
                    });
                }
            }
        } else {
            
            console.log('\n Final response ready');
            return response.content;
        }
    }

    const finalResponse = await geminiModel.invoke(messages);
    return finalResponse.content;
}


app.get('/api/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        message: 'Smart Restaurant AI (Gemini) is running!',
        timestamp: new Date().toISOString()
    });
});

app.post('/api/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!message) {
            return res.status(400).json({ 
                error: 'Message is required',
                success: false 
            });
        }

        const response = await runAgent(message);
        
        console.log(`\n📤 Bot: ${response}\n`);

        res.json({
            success: true,
            response: response,
            timestamp: new Date().toISOString()
        });

    } catch (error) {
        console.error(' Error:', error.message);
        
        res.status(500).json({
            success: false,
            error: 'Something went wrong. Please try again.',
            details: error.message
        });
    }
});

app.get('/api/tools', (req, res) => {
    res.json({ 
        tools: tools.map(t => ({ name: t.name, description: t.description }))
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log('\n🍽️  Smart Restaurant AI Assistant');
    console.log('🤖 Powered by Google Gemini');
    console.log('='.repeat(40));
    console.log(`🚀 Server: http://localhost:${PORT}`);
    console.log(`📡 API: http://localhost:${PORT}/api/chat`);
    console.log(`🔧 Tools: ${tools.length} loaded`);
    console.log('='.repeat(40) + '\n');
});