import express, { Response, Request } from "express";
// @ts-ignore
import sse from "sse-express";
import cors from "cors";
import { Observer, Subscriber } from "./observer";
import { INotify, IUsers } from "./types";
const sub: Subscriber = new Subscriber();

const users: IUsers[] = [{ name: "ana" }, { name: "julia" }, { name: "v" }, { name: "lisa" }, { name: "cj" }];
let notify: INotify[] = [];

const app = express();
app.use(express.json());
app.use(cors());

const port = 10000;

// @ts-ignore
app.get("/listen", sse, (req, res: Response & { sse: any }) => {
  let number = 1;
  const user = req.query.user as string;

  const userScriber = new Observer(user, (message) => {
    res.sse("notify", {
      data: `notify ${number} to ${user} ${JSON.stringify(message)}`,
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
  const newNotify = { title, content, users };

  notify.push(newNotify);

  console.log("notify all");
  sub.notifyAll(newNotify);

  res.status(201).send();
});

app.get("/notify", (req, res: Response) => {
  const userName = (req.headers["user"] as string) || "";

  res.json(
    notify.filter((notifyItem) => {
      return notifyItem.users.some((user) => {
        return user.name.includes(userName);
      });
    }),
  );
});

app.get("/clearNotify", (_req, res) => {
  notify = [];
});

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`);
});
