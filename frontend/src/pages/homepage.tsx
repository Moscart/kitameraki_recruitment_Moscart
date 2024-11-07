import { Link, useLoaderData, useRevalidator } from "react-router-dom";
import { deleteTask, getTasks, Task, updateTask } from "../task";
import { Button } from "@fluentui/react-components";
import { useEffect, useRef, useState } from "react";
import ScrollMagic from "scrollmagic";

export async function loader() {
  const tasks = await getTasks();
  return { tasks };
}

export function Homepage() {
  const { tasks: initialTasks } = useLoaderData() as { tasks: Task[] };
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const revalidator = useRevalidator();
  const [originalTitles, setOriginalTitles] = useState<{
    [key: string]: string;
  }>({});

  const [hasLoaded, setHasLoaded] = useState<boolean>(false);
  const prevTaskLength = useRef<number>(0);
  const loaderRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

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

  useEffect(() => {
    const controller = new ScrollMagic.Controller();

    const scene = new ScrollMagic.Scene({
      triggerElement: ".trigger",
      triggerHook: "onEnter",
    })
      .on("enter", () => {
        console.log(tasks.length);
        if (tasks.length % 10 === 0 && !hasLoaded) {
          loaderRef?.current?.classList.remove("opacity-0");
          setTimeout(loadMoreTasks, 1000);
        }
      })
      .addTo(controller);
    return () => {
      scene.destroy();
      controller.destroy(true);
    };
  }, [tasks, hasLoaded]);

  useEffect(() => {
    if (tasks.length !== prevTaskLength.current) {
      setHasLoaded(false);
    }

    prevTaskLength.current = tasks.length;
  }, [tasks]);

  const loadMoreTasks = async () => {
    const page = tasks.length / 10;

    const newTasks = await getTasks(page + 1);
    setTasks((prevTasks) => [...prevTasks, ...newTasks]);
    loaderRef?.current?.classList.add("opacity-0");
    setHasLoaded(true);
  };

  return (
    <div className="max-w-screen-xl mx-auto px-6 my-20">
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
      <div
        ref={loaderRef}
        className="trigger text-center mt-10 font-bold text-lg"
      >
        Loading...
      </div>
    </div>
  );
}
