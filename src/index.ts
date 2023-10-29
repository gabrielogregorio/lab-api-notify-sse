import express, { Response, Request } from "express";
// @ts-ignore
import sse from "sse-express";
import cors from "cors";

interface IUsers {
  name: string;
}

const users: IUsers[] = [{ name: "ana" }, { name: "julia" }, { name: "v" }, { name: "lisa" }, { name: "cj" }];

type Notify = {
  title: string;
  content: string;
  users: IUsers[];
};

let notify: Notify[] = [];
const app = express();
app.use(express.json());

const port = 10000;

app.use(cors("*"));

// @ts-ignore
app.get("/listen", sse, (_req, res: Response & { sse: any }) => {
  let number = 1;

  setInterval(() => {
    res.sse("notify", {
      data: `notify number ${number}`,
    });
    number += 1;
  }, 400);
});

app.get("/users", (_req, res) => {
  return res.json(users);
});

app.get("/", (_req, res) => {
  res.json({ message: "api is running" });
});

app.post("/notify", (req: Request<unknown, unknown, { title: string; content: string; users: IUsers[] }>, res: Response) => {
  console.log(req.body, "aaa");
  const { title, content, users } = req.body;

  notify.push({
    title,
    content,
    users,
  });

  console.log(notify);

  res.status(201).send();
});

app.get("/notify", (req, res: Response) => {
  const userName = (req.headers["user-name"] as string) || "";

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
