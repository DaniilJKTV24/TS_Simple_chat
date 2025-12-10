# Simple Chat App

![Node.js](https://img.shields.io/badge/Node.js-18.x-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue)
![Express](https://img.shields.io/badge/Express-5.1-lightgrey)
![Socket.io](https://img.shields.io/badge/Socket.io-4.8-orange)
![License](https://img.shields.io/badge/License-MIT-blue)

A simple real-time chat application built with **Express**, **Socket.io**, and **TypeScript** following the **MVC** pattern. No login is required — just type your username and message to start chatting!

---

## Features

- Real-time messaging using Socket.io
- Simple username input (no authentication required)
- Organized with **MVC architecture**
- TypeScript support
- ngrok tunnel for external access

---

## Project Structure

```
project/
├─ public/
│  ├─ index.html
│  ├─ style.css
│  └─ client.js
├─ src/
│  ├─ controllers/
│  │  └─ chatController.ts
│  ├─ models/
│  │  └─ chatMessage.ts
│  ├─ routes/
│  │  └─ chatRoutes.ts
│  ├─ services/
│  │  └─ socketService.ts
│  └─ server.ts
├─ dist/                  # Generated after build
├─ package.json
├─ package-lock.json
├─ tsconfig.json
├─ tunnel.js
└─ README.md
```

---

## Installation

1. Clone the repository:

```bash
git clone <https://github.com/DaniilJKTV24/TS_Simple_chat>
```

2. Install dependencies:

```bash
npm install
```

3. Create a `.env` file with your ngrok token:

```
PORT=3000
NGROK_AUTHTOKEN=your_ngrok_token_here
```

---

## Scripts

| Script | Description |
|--------|-------------|
| `npm run build` | Compile TypeScript into `dist/` |
| `npm start` | Run the compiled server from `dist/` |
| `npm run dev` | Run the server with live TypeScript support (`ts-node` + `nodemon`) |
| `npm run tunnel` | Start ngrok tunnel using `tunnel.js` |
| `npm run dev:tunnel` | Run server in dev mode and ngrok tunnel simultaneously |

---

## Usage

1. Start the development server:

```bash
npm run dev
```

or build and start production:

```bash
npm run build
npm start
```

2. Open your browser and go to:

```
http://localhost:3000
```

3. Enter your username and start chatting!

4. Using ngrok for external access:

```bash
npm run tunnel
```

The console will display a public URL.

---

## TypeScript Configuration

Your `tsconfig.json` is set up as follows:

```json
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "commonjs",
    "rootDir": "src",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "moduleResolution": "node",
    "resolveJsonModule": true,
    "skipLibCheck": true,
    "types": ["node"],
    "sourceMap": true
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules"]
}
```

---


### Runtime Dependencies

- **express** – Web framework for handling HTTP requests and serving static files.
- **socket.io** – Enables real-time, bidirectional communication between clients and server.
- **cors** – Middleware to enable cross-origin requests (useful for frontend development on different ports).
- **dotenv** – Loads environment variables from a `.env` file.
- **ngrok** – Exposes your local server to the internet via a secure tunnel.
- **fs** – Node.js built-in module used in `tunnel.js` to check whether a local ngrok executable exists in `node_modules/.bin` before using it.

### Dev Dependencies

- **typescript** – TypeScript compiler for type-safe JavaScript development.
- **ts-node** – Runs TypeScript files directly without compiling.
- **nodemon** – Watches for file changes and restarts the server automatically.
- **@types/node, @types/express, @types/cors** – Type definitions for Node.js and libraries.

---

## Notes

- This app does not implement authentication — usernames are not validated.
- The `dist` folder is generated after running `npm run build`.
- Use `npm run dev:tunnel` for development with external access.
- For production, always run `npm run build` and `npm start`.

---

## License

MIT
