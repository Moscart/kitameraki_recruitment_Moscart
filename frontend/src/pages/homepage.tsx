import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import { deleteTask, getTasks, Task, updateTask } from "../task";
import { Button } from "@fluentui/react-components";
import { useState } from "react";

export async function loader() {
  const tasks = await getTasks();
  return { tasks };
}

export function Homepage() {
  const { tasks } = useLoaderData() as { tasks: Task[] };
  const revalidator = useRevalidator();
  const [originalTitles, setOriginalTitles] = useState<{
    [key: string]: string;
  }>({});

  const handleDelete = (id: string) => {
    deleteTask(id).then(() => revalidator.revalidate());
  };

  const handleUpdate = (
    e: React.KeyboardEvent<HTMLDivElement> | React.FocusEvent<HTMLDivElement>,
    id: string,
    task: Task
  ) => {
    if (!task.title.trim()) {
      alert("Title cannot be empty");
      (e.target as HTMLDivElement).textContent =
        originalTitles[task.id as string];
      return;
    }
    updateTask(id, task).then(() => revalidator.revalidate());
  };

  const handleFocus = (id: string, title: string) => {
    setOriginalTitles((prevState) => ({ ...prevState, [id]: title }));
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 mt-20">
      <div className="flex justify-between items-center">
        <h1 className="font-bold text-3xl">Task List</h1>
        <div className="">
          <Link
            className="bg-black text-white rounded-xl px-6 py-4 font-bold"
            to="/add"
          >
            + Add Task
          </Link>
        </div>
      </div>
      <div className="grid gap-4 mt-6">
        {tasks.length ? (
          tasks.map((task) => (
            <div
              className="bg-neutral-200 rounded-xl p-6 flex justify-between items-center"
              key={task.id}
            >
              <div className="">
                <div
                  suppressContentEditableWarning
                  contentEditable
                  className="min-w-40 font-bold text-lg"
                  onFocus={() => handleFocus(task.id as string, task.title)}
                  onKeyDown={(e) => {
                    if (e.which === 13) {
                      e.preventDefault();
                      (e.target as HTMLDivElement).blur();
                    }
                  }}
                  onBlur={(e) =>
                    handleUpdate(e, task.id as string, {
                      ...task,
                      title: e.target.textContent as string,
                    })
                  }
                >
                  {task.title}
                </div>
                <div
                  className="min-w-40 "
                  contentEditable
                  suppressContentEditableWarning
                  onKeyDown={(e) => {
                    if (e.which === 13) {
                      e.preventDefault();
                      (e.target as HTMLDivElement).blur();
                    }
                  }}
                  onBlur={(e) =>
                    handleUpdate(e, task.id as string, {
                      ...task,
                      description: e.target.textContent as string,
                    })
                  }
                >
                  {task.description}
                </div>
              </div>
              <div className="">
                <Button onClick={() => handleDelete(task.id as string)}>
                  Delete
                </Button>
              </div>
            </div>
          ))
        ) : (
          <p>No tasks</p>
        )}
      </div>
    </div>
  );
}
