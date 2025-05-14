<h1 align="center">AI-Powered Notion-style Collaborative Note Taking App</h1>

### About This Project
Users can easily sign up/in and authenticate with Clerk. Once in, they can create, delete and update documents. Users are also able to invite friends to collaborate with them on documents in real-time. 

The build includes two AI features: 
1. translate and summarise the current document in a foreign (non-English) language. 
2. Ask AI a question about the current document.


### Tech Stack
This app was built with React, Next.js and Typescript for additional error checking. Tailwind CSS was also used for a better developer experience and to reduce the amount of CSS served at production. Shadcn was used for creating generic components.

### Key Features
- Easy authentication and sign up/in handled by Clerk.
- Easily switch between light and dark modes.
- Share the document and collaborate with colleagues and friends in real-time provided via LiveBlocks with live cursors and rich text editing.
- Rooms and docs managed by a NoSQL Firestore database.
- Translate (cf/meta/m2m100-1.2b) and summarise (cf/facebook/bart-large-cnn) document with Cloudflare Workers
- Ask AI questions about the document with OpenAI (gpt-4o)

### Future Improvements
Build it out into a more feature-rich app similar to Notion App.


## 🚀 Getting Started

Follow these steps to get the project up and running locally:

### Prerequisites

- Node.js (v18.x or higher recommended)
- npm or yarn

### Installation

1. **Clone the repository:**
    ```bash
    git clone https://github.com/nickrogerson1/notion-app.git
    cd notion-app
    ```

2. **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3. **Start the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

4. **Open your browser and visit:**
    ```
    http://localhost:3000
    ```

---

### 📦 Build for Production

To build the application for production, run:

```bash
npm run build
npm run start
# or
yarn build
yarn start
