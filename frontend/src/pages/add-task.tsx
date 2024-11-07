import { Button, Field, Input, Textarea } from "@fluentui/react-components";
import { createTask } from "../task";
import { Form, redirect } from "react-router-dom";

export async function action({ request }: { request: Request }) {
  const formData = await request.formData();
  const newTask = Object.fromEntries(formData) as {
    title: string;
    description?: string;
  };
  await createTask(newTask);
  return redirect("/");
}

export function AddTask() {
  return (
    <div className="max-w-screen-xl mx-auto px-6 mt-20">
      <h1 className="text-3xl font-bold">Create Task</h1>
      <Form method="POST" className="grid gap-6 max-w-sm mt-10">
        <div className="">
          <Field label="Title" required>
            <Input placeholder="Input your title" required name="title" />
          </Field>
        </div>
        <div className="">
          <Field label="Description">
            <Textarea
              placeholder="Input your description..."
              name="description"
            />
          </Field>
        </div>
        <Button type="submit">Get started</Button>
      </Form>
    </div>
  );
}
