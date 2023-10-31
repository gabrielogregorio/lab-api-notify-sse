import express, { Response, Request } from "express";
// @ts-ignore
import sse from "sse-express";
import cors from "cors";
import { Observer, Subscriber } from "./observer";
import { IUsers } from "./types";
import { DatabaseMemory } from "./DatabaseMemory";
import { Server } from "ws";

const sub: Subscriber = new Subscriber();

const users: IUsers[] = [{ name: "ana" }, { name: "julia" }, { name: "v" }, { name: "lisa" }, { name: "cj" }];

const app = express();
app.use(express.json());
app.use(cors());

const port = 10000;

const memoryDatabase = new DatabaseMemory();

// @ts-ignore
app.get("/listen", sse, (req, res: Response & { sse: any }) => {
  const user = req.query.user as string;

  const userScriber = new Observer(user, "sse", (message) => {
    res.sse("notify", {
      message,
    });
  });

  sub.subscribe(userScriber);
});

app.get("/users", (_req, res) => {
  return res.json(users);
});

app.get("/", (_req, res) => {
  res.json({ message: "api is running" });
});

app.post("/notify", (req: Request<unknown, unknown, { title: string; content: string; users: IUsers[] }>, res: Response) => {
  const { title, content, users } = req.body;
  const newNotify = { title, content, users, id: new Date().getTime().toString() };

  memoryDatabase.push(newNotify);

  sub.notifyAll(newNotify);

  res.status(201).send();
});

app.get("/all", (req, res: Response) => {
  res.json(memoryDatabase.notify);
});

app.get("/notify", (req, res: Response) => {
  const userName = req.headers["user"] as string;
  if (!userName) {
    return res.json([]);
  }

  res.json(memoryDatabase.findNotifyByUserName(userName));
});

app.get("/clearNotify", (_req, res) => {
  memoryDatabase.reset();
  res.status(200).send();
});

import http from "http";
import WebSocket from "ws";

const server = http.createServer(app);
const wss = new Server({ server: server });

wss.on("connection", (ws: WebSocket, req: http.IncomingMessage) => {
  const params = new URLSearchParams(req.url?.split("?")[1]);
  const name = params.get("name");

  if (!name) {
    ws.terminate();
    return;
  }

  const userScriber = new Observer(name, "ws", (message) => {
    ws.send(
      JSON.stringify({
        message,
      }),
    );
  });

  sub.subscribe(userScriber);

  ws.on("close", () => {
    console.log("server is close");
  });
});

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
