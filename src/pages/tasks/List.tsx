import { KanbanColumnSkeleton, ProjectCardSkeleton } from "@/components";
import { TaskCardMemo } from "@/components/tasks/kanban/card";
import { KanbanAddCardButton } from "@/components/tasks/kanban/KanbanAddCardButton";
import {
  KanbanBoard,
  KanbanBoardContainer,
} from "@/components/tasks/kanban/KanbanBoardContainer";
import KanbanColumn from "@/components/tasks/kanban/KanbanColumn";
import KanbanItem from "@/components/tasks/kanban/KanbanItem";
import { UPDATE_TASK_STAGE_MUTATION } from "@/graphql/mutations";
import { TASK_STAGES_QUERY, TASKS_QUERY } from "@/graphql/queries";
import { TasksQuery, TaskStagesQuery } from "@/graphql/types";
import { DragEndEvent } from "@dnd-kit/core";
import { useList, useNavigation, useUpdate } from "@refinedev/core";
import { GetFieldsFromList } from "@refinedev/nestjs-query";
import React, { useMemo } from "react";

type Task = GetFieldsFromList<TasksQuery>;

type TaskStage = GetFieldsFromList<TaskStagesQuery> & { tasks: Task[] };
function List({ children }: React.PropsWithChildren) {
  const { data: stages, isLoading: isLoadingStages } = useList<TaskStage>({
    resource: "taskStages",
    filters: [
      {
        field: "title",
        value: ["TODO", "IN PROGRESS", "DONE", "IN REVIEW"],
        operator: "in",
      },
    ],
    sorters: [{ field: "createdAt", order: "asc" }],
    meta: {
      gqlQuery: TASK_STAGES_QUERY,
    },
  });

  const { data: tasks, isLoading: isLoadingTasks } = useList<
    GetFieldsFromList<TasksQuery>
  >({
    resource: "tasks",
    sorters: [
      {
        field: "dueDate",
        order: "asc",
      },
    ],
    pagination: {
      mode: "off",
    },
    queryOptions: {
      enabled: !!stages,
    },
    meta: {
      gqlQuery: TASKS_QUERY,
    },
  });

  const { replace } = useNavigation();

  const { mutate: updateTask } = useUpdate();

  const taskStages = useMemo(() => {
    if (!tasks?.data || !stages?.data)
      return {
        unAssignedStage: [],
        stages: [],
      };

    const unAssignedStage = tasks.data.filter((task) => task.stageId === null);

    const grouped: TaskStage[] = stages?.data.map((stage) => ({
      ...stage,
      tasks: tasks.data.filter((task) => {
        return task.stageId?.toString() === stage.id;
      }),
    }));

    return {
      unAssignedStage,
      columns: grouped,
    };
  }, [stages, tasks]);

  const handleAddCard = (args: { stageId: string }) => {
    const path =
      args.stageId === "unassigned"
        ? "/tasks/new"
        : `/tasks/new/${args.stageId}`;
    replace(path);
  };

  const handleOnDragEnd = (event: DragEndEvent) => {
    let stageId = event.over?.id as undefined | string | null;
    const taskId = event.active.id as string;
    const taskStageId = event.active.data.current?.stageId;

    if (taskStageId === stageId) return;

    if (stageId === "unassigned") {
      stageId = null;
    }

    updateTask({
      resource: "tasks",
      id: taskId,
      values: {
        stageId,
      },
      successNotification: false,
      mutationMode: "optimistic",
      meta: { gqlMutation: UPDATE_TASK_STAGE_MUTATION },
    });
  };

  const isLoading = isLoadingStages || isLoadingTasks;

  if (isLoading) return <PageSkeleton />;

  return (
    <>
      <KanbanBoardContainer>
        <KanbanBoard onDragEnd={handleOnDragEnd}>
          <KanbanColumn
            id="unassigned"
            title="unassigned"
            count={taskStages.unAssignedStage.length || 0}
            onAddClick={() => handleAddCard({ stageId: "unassigned" })}
          >
            {taskStages.unAssignedStage.map((task) => (
              <KanbanItem
                id={task.id}
                key={task.id}
                data={{ ...task, stageId: "unassigned" }}
              >
                <TaskCardMemo {...task} dueDate={task.dueDate || undefined} />
              </KanbanItem>
            ))}
            {!!taskStages.unAssignedStage.length && (
              <KanbanAddCardButton
                onClick={() => handleAddCard({ stageId: "unassigned" })}
              />
            )}
          </KanbanColumn>

          {taskStages.columns?.map((col) => (
            <KanbanColumn
              key={col.id}
              id={col.id}
              title={col.title}
              count={col.tasks.length}
              onAddClick={() => handleAddCard({ stageId: col.id })}
            >
              {!isLoading &&
                col.tasks.map((task) => (
                  <KanbanItem id={task.id} key={task.id} data={task}>
                    <TaskCardMemo
                      {...task}
                      dueDate={task.dueDate || undefined}
                    />
                  </KanbanItem>
                ))}
              {!!col.tasks.length && (
                <KanbanAddCardButton
                  onClick={() => handleAddCard({ stageId: col.id })}
                />
              )}
            </KanbanColumn>
          ))}
        </KanbanBoard>
      </KanbanBoardContainer>
      {children}
    </>
  );
}

export default List;

const PageSkeleton = () => {
  const columns = 6;
  const items = 4;

  return (
    <KanbanBoardContainer>
      {Array.from({ length: columns }).map((_, i) => (
        <KanbanColumnSkeleton key={i}>
          {Array.from({ length: items }).map((_, i) => (
            <ProjectCardSkeleton key={i} />
          ))}
        </KanbanColumnSkeleton>
      ))}
    </KanbanBoardContainer>
  );
};
