import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { SortableContext, arrayMove } from "@dnd-kit/sortable";
import { IconPlus } from "@tabler/icons-react";
import { useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { v4 as uuid, UUIDTypes } from "uuid";
import ColumnContainer from "./ColumnContainer";
import TaskCard from "./TaskCard";

// нет времени делать типы

function KanbanBoard({ state }: any) {
  const defaultCols =
    state?.state?.columns?.map((col: any) => ({
      id: col?.id,
      title: col?.title,
    })) || [];

  const defaultTasks =
    state?.state?.tasks?.map((task: any) => ({
      id: task?.id,
      columnId: task?.columnId,
      content: task?.content,
    })) || [];

  const [columns, setColumns] = useState(defaultCols);
  const columnsId = useMemo(() => columns.map((col: any) => col.id), [columns]);
  const [tasks, setTasks] = useState(defaultTasks);
  const [activeColumn, setActiveColumn] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 10 } })
  );

  return (
    <div className="mt-5 min-h-[70vh] w-72 text-white">
      <DndContext
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragOver={onDragOver}
      >
        <div className="m-auto flex gap-4">
          <div className="flex gap-4">
            <SortableContext items={columnsId}>
              {columns.map((col: any) => (
                <ColumnContainer
                  key={col.id}
                  column={col}
                  deleteColumn={deleteColumn}
                  updateColumn={updateColumn}
                  createTask={createTask}
                  deleteTask={deleteTask}
                  updateTask={updateTask}
                  tasks={tasks.filter((task: any) => task.columnId === col.id)}
                />
              ))}
            </SortableContext>
          </div>
          <button
            onClick={() => createNewColumn()}
            className="flex h-[60px] w-[350px] min-w-[350px] cursor-pointer gap-2 rounded-lg border-2 border-columnBackgroundColor bg-mainBackgroundColor p-4 ring-green-500 hover:ring-2"
          >
            <IconPlus />
            Add Column
          </button>
        </div>
        {createPortal(
          <DragOverlay>
            {activeColumn && (
              <ColumnContainer
                column={activeColumn}
                deleteColumn={deleteColumn}
                updateColumn={updateColumn}
                createTask={createTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
                tasks={tasks.filter(
                  //@ts-expect-error some text for resolve problem with never type
                  (task: any) => task.columnId === activeColumn.id
                )}
              />
            )}
            {activeTask && (
              <TaskCard
                task={activeTask}
                deleteTask={deleteTask}
                updateTask={updateTask}
              />
            )}
          </DragOverlay>,
          document.body
        )}
      </DndContext>
    </div>
  );

  function createTask(columnId: any) {
    const newTask = {
      id: uuid(),
      columnId,
      content: `Task ${tasks.length + 1}`,
    };
    setTasks([...tasks, newTask]);
  }

  function deleteTask(id: UUIDTypes) {
    const newTasks = tasks.filter((task: any) => task.id !== id);
    setTasks(newTasks);
  }

  function updateTask(id: UUIDTypes, content: any) {
    const newTasks = tasks.map((task: any) =>
      task.id === id ? { ...task, content } : task
    );
    setTasks(newTasks);
  }

  function deleteColumn(id: UUIDTypes) {
    setColumns(columns.filter((col: any) => col.id !== id));
    setTasks(tasks.filter((task: any) => task.columnId !== id));
  }

  function updateColumn(id: UUIDTypes, title: string) {
    setColumns(
      columns.map((col: any) => (col.id === id ? { ...col, title } : col))
    );
  }

  function createNewColumn() {
    const newColumn = {
      id: uuid(),
      title: `Column ${columns.length + 1}`,
    };
    setColumns([...columns, newColumn]);
  }

  function onDragStart(event: any) {
    if (event.active.data.current?.type === "Column") {
      setActiveColumn(event.active.data.current.column);
    } else if (event.active.data.current?.type === "Task") {
      setActiveTask(event.active.data.current.task);
    }
  }

  function onDragEnd(event: any) {
    setActiveColumn(null);
    setActiveTask(null);

    const { active, over } = event;
    if (!over) return;

    if (active.id === over.id) return;

    const isActiveAColumn = active.data.current?.type === "Column";
    if (isActiveAColumn) {
      setColumns((columns: any) => {
        const activeIndex = columns.findIndex(
          (col: any) => col.id === active.id
        );
        const overIndex = columns.findIndex((col: any) => col.id === over.id);
        return arrayMove(columns, activeIndex, overIndex);
      });
    } else {
      const isActiveATask = active.data.current?.type === "Task";
      const isOverATask = over.data.current?.type === "Task";
      if (isActiveATask && isOverATask) {
        setTasks((tasks: any) => {
          const activeIndex = tasks.findIndex((t: any) => t.id === active.id);
          const overIndex = tasks.findIndex((t: any) => t.id === over.id);
          if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
            tasks[activeIndex].columnId = tasks[overIndex].columnId;
            return arrayMove(tasks, activeIndex, overIndex - 1);
          }
          return arrayMove(tasks, activeIndex, overIndex);
        });
      } else if (isActiveATask) {
        setTasks((tasks: any) => {
          const activeIndex = tasks.findIndex((t: any) => t.id === active.id);
          tasks[activeIndex].columnId = over.id;
          return arrayMove(tasks, activeIndex, activeIndex);
        });
      }
    }
  }

  function onDragOver(event: any) {
    const { active, over } = event;
    if (!over) return;

    if (active.id === over.id) return;

    const isActiveATask = active.data.current?.type === "Task";
    const isOverATask = over.data.current?.type === "Task";
    if (isActiveATask && isOverATask) {
      setTasks((tasks: any) => {
        const activeIndex = tasks.findIndex((t: any) => t.id === active.id);
        const overIndex = tasks.findIndex((t: any) => t.id === over.id);
        if (tasks[activeIndex].columnId !== tasks[overIndex].columnId) {
          tasks[activeIndex].columnId = tasks[overIndex].columnId;
          return arrayMove(tasks, activeIndex, overIndex - 1);
        }
        return arrayMove(tasks, activeIndex, overIndex);
      });
    } else if (isActiveATask) {
      setTasks((tasks: any) => {
        const activeIndex = tasks.findIndex((t: any) => t.id === active.id);
        tasks[activeIndex].columnId = over.id;
        return arrayMove(tasks, activeIndex, activeIndex);
      });
    }
  }
}

export default KanbanBoard;
