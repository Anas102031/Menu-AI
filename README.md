# 🍽️ Menu AI — Smart Restaurant AI Assistant

> Your intelligent restaurant companion — explore menus, find dishes, and get instant answers powered by AI.

---

## 📌 What is Menu AI?

**Menu AI** is an AI-powered restaurant assistant that helps customers interact with a restaurant in a smart and conversational way. Instead of browsing through a physical menu or waiting for a waiter, customers can simply **ask anything** — from menu items and prices to restaurant location and contact info — and get instant, accurate answers.

Built for **Spice Garden Restaurant**, Menu AI makes dining smarter, faster, and more enjoyable.

---

## ✨ Features

- 📋 **View Full Menus** — Get breakfast, lunch, and dinner menus instantly
- 🔍 **Search Any Dish** — Search for a specific dish by name
- 💰 **Price Information** — Get min, max, and average prices per meal category
- 📍 **Restaurant Info** — Location, contact number, and ratings on demand
- 💬 **Natural Conversation** — Chat naturally, no commands needed
- ⚡ **Quick Action Buttons** — One-click access to popular queries
- 🤖 **AI Agent with Tools** — Smart agent that picks the right tool for every question

---

## 🛠️ Tech Stack

| Technology | Purpose |
|---|---|
| **Node.js + Express** | Backend server |
| **LangChain (JS)** | AI agent & tool management |
| **OpenRouter API** | LLM provider (DeepSeek model) |
| **Zod** | Tool schema validation |
| **HTML + CSS + JS** | Frontend chat UI |
| **dotenv** | Environment variable management |

---

## 🤖 AI Tools Available

Menu AI uses a smart agent with **4 built-in tools**:

| Tool | What It Does |
|---|---|
| `get_menu` | Fetches full menu for breakfast, lunch, or dinner |
| `search_dish` | Searches for a specific dish by name |
| `get_restaurant_info` | Returns location, contact, or rating info |
| `get_price_range` | Returns min, max, and average prices for a meal |

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/menu-ai.git
cd menu-ai
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Create a `.env` file in the root directory:
```env
GOOGLE_API_KEY=your_openrouter_api_key_here
PORT=3000
```

### 4. Run the Server
```bash
node server.js
```

### 5. Open in Browser
```
http://localhost:3000
```

---

## 🎮 How to Use

1. **Open the app** in your browser
2. **Click quick buttons** — Breakfast, Lunch, Dinner, or Info
3. **Or type any question** like:
   - *"Show me the dinner menu"*
   - *"How much is Paneer Butter Masala?"*
   - *"What is the restaurant location?"*
   - *"What are the cheapest lunch items?"*
4. **Get instant AI answer** with full details

---

## 📁 Project Structure

```
menu-ai/
├── public/
│   ├── index.html        # Frontend chat UI
│   ├── style.css         # Styling
│   └── script.js         # Frontend logic
├── server.js             # Backend + AI agent + tools
├── .env                  # API keys (not committed)
└── README.md             # Project documentation
```

---

## 🍱 Restaurant Menu Data

Menu AI currently serves **Spice Garden Restaurant** with:

| Meal | Timing | Items |
|---|---|---|
| 🌅 Breakfast | 7:00 AM - 11:00 AM | Aloo Paratha, Poha, Chai & more |
| ☀️ Lunch | 12:00 PM - 4:00 PM | Paneer Masala, Dal Fry, Roti & more |
| 🌙 Dinner | 7:00 PM - 11:00 PM | Biryani, Naan, Gulab Jamun & more |

---

## 🔮 Future Plans

- [ ] Online order placement
- [ ] Table reservation system
- [ ] Multi-restaurant support
- [ ] Voice input support
- [ ] Order history & tracking
- [ ] Multi-language support (Urdu/English)

---

## 🧑‍💻 Built With ❤️ using LangChain + Express

> **Menu AI** — *Because great food deserves a smart assistant.*
