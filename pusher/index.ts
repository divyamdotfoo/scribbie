import Pusher from "pusher";
export const pusher = new Pusher({
  appId: process.env.app_id!,
  key: process.env.key!,
  secret: process.env.secret!,
  cluster: "ap2",
  useTLS: true,
});
// the secret is changed
