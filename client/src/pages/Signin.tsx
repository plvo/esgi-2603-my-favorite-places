import { Button } from "../components/Button";
import { Form } from "../components/Form";
import { Input } from "../components/Input";
import { Layout } from "../components/Layout";
import axios from "axios";
import { toast } from "react-hot-toast";

export function SigninPage() {
  async function onSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.target);
    const json = { email: form.get("email"), password: form.get("password") };
    const { data } = await axios.post<{ token: string }>(
      "/api/users/tokens",
      json,
    );

    if (data?.token) {
      const meResult = await axios.get("/api/users/me", {
        headers: { Authorization: `Bearer ${data.token}` },
      });

      if (meResult.data?.item?.id) {
        localStorage.setItem("token", data?.token);
        sessionStorage.setItem("user", meResult.data?.item);
        toast.success("You are connected");
        location.href = "/";
      } else {
        toast.error("Unable to sign in");
      }
    } else {
      toast.error("Unable to sign in");
    }
  }

  return (
    <Layout title="Home page">
      <p>Sign in on the App</p>
      <Form onSubmit={onSubmit}>
        <Input name="email" type="email" placeholder="User email" />
        <Input name="password" type="password" placeholder="Password" />
        <Button type="submit">Signin</Button>
      </Form>
    </Layout>
  );
}
