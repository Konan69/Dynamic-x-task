import { CreateTask } from "@/components/Modals";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { OptionsMenu } from "@/components/Dropdown";
import { Task } from "@/types";
import { useDeleteTask, useGetTasks, useUpdateTask} from "./useTodo";

interface statusProps {
  title: string;
  cards: Task[];
  status: string;
  setCards: React.Dispatch<React.SetStateAction<Task[]>>;
}
interface DropProps {
  beforeId: string;
  status: string;
}

interface CardProps {
  title: string;
  uuid: string;
  status: string;
  handleDrag: (e: React.DragEvent<HTMLDivElement>, card: Task) => void;
  setCards: React.Dispatch<React.SetStateAction<Task[]>>;
}

interface DragEvent {
  clientY: number;
}

interface IndicatorType {
  offset: number;
  element: HTMLElement;
}



export const Todo = () => {
  return (
    <div className="w-full h-full flex flex-col">

      <div className="p-6 flex flex-col gap-6">
        <div className="flex justify-end">
          <CreateTask />
        </div>
      </div>

      <Board />
    </div>
  );
};

const Board = () => {
  const { data: tasks, isLoading } = useGetTasks();
  const [cards, setCards] = useState<Task[]>([]);

  useEffect(() => {
    if (tasks) {
      setCards(tasks);
    }
  }, [tasks]);

  if (isLoading) {
    return <div className="p-12">Loading...</div>;
  }

  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Status title="To Do" cards={cards} status="Todo" setCards={setCards} />
      <Status
        title="In Progress"
        cards={cards}
        status="In-Progress"
        setCards={setCards}
      />
      <Status title="Done" cards={cards} status="Done" setCards={setCards} />
    </div>
  );
};

const Status = ({ title, cards, status, setCards }: statusProps) => {
  const { updateTaskMutation } = useUpdateTask();
  const [active, setActive] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, card: Task) => {
    e.dataTransfer.setData("cardId", card.uuid);
  };

  const highlight = (e: DragEvent) => {
    const indicators = getIndicators();
    clearHighlights(indicators);
    const nearest = getNearestIndicator(e, indicators);
    nearest.element.style.opacity = "1";
  };

  const getNearestIndicator = (
    e: DragEvent,
    indicators: HTMLElement[],
  ): IndicatorType => {
    const DISTANCE_OFFSET = 50;
    const nearest = indicators.reduce(
      (closest: IndicatorType, child: HTMLElement): IndicatorType => {
        const box = child.getBoundingClientRect();
        const offset = e.clientY - box.top + DISTANCE_OFFSET;

        if (offset < 0 && offset > closest.offset) {
          return { offset, element: child };
        } else {
          return closest;
        }
      },
      {
        offset: Number.NEGATIVE_INFINITY,
        element: indicators[indicators.length - 1],
      },
    );

    return nearest;
  };

  const getIndicators = (): HTMLElement[] => {
    return Array.from(document.querySelectorAll(`[data-status="${status}"]`));
  };

  const clearHighlights = (elements?: HTMLElement[]) => {
    const indicators = elements || getIndicators();
    indicators.forEach((i) => {
      (i as HTMLElement).style.opacity = "0";
    });
  };

  const handleDragOver = (e: any) => {
    e.preventDefault();
    highlight(e);
    setActive(true);
  };

  const handleDragLeave = () => {
    setActive(false);
    clearHighlights();
  };

  const handleDragEnd = (e: any) => {
    setActive(false);
    clearHighlights();
    
    const cardId = e.dataTransfer.getData("cardId");
    
    updateTaskMutation({
      uuid: cardId,
      status: status,
    });

    if (filteredCards.length === 0) {
      let copy = [...cards];
      let cardToTransfer = copy.find((card) => card.uuid === cardId);
      if (!cardToTransfer) return;

      cardToTransfer = { ...cardToTransfer, status };
      copy = copy.filter((card) => card.uuid !== cardId);
      copy.push(cardToTransfer);
      setCards(copy);
      return;
    }

    const indicators = getIndicators();
    const nearest = getNearestIndicator(e, indicators);
    const beforeId = nearest.element.dataset.beforeId || "-1";

    if (beforeId !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((card) => card.uuid === cardId);
      if (!cardToTransfer) return;

      cardToTransfer = { ...cardToTransfer, status };
      copy = copy.filter((card) => card.uuid !== cardId);

      const moveToBack = beforeId === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const beforeIndex = copy.findIndex((card) => card.uuid === beforeId);
        copy.splice(beforeIndex + 1, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const filteredCards = cards.filter((card: Task  ) => card.status === status);

  return (
    <div className="w-56 shrink-0 bg-baseform p-4 rounded-xl">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-lg text-white">{title}</h3>
        <span className=" px-2 py-1 text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDragEnd}
        className={`min-h-[100px] w-full transition-colors ${
          active ? "bg-neutral-800/20" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.length === 0 ? (
          <DropIndicator beforeId="-1" status={status} />
        ) : (
          filteredCards.map((card) => (
            <Card
              key={card.uuid}
              {...card}
              handleDrag={handleDrag}
              setCards={setCards}
            />
          ))
        )}
      </div>
    </div>
  );
};

const Card = ({ title, uuid, status, handleDrag }: CardProps) => {
  const { updateTaskMutation } = useUpdateTask();
  const { deleteTaskMutation } = useDeleteTask();

  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleEdit = () => {
    setIsEditing(true);
  };


  const handleSave = () => {
    updateTaskMutation({
      uuid: uuid,
      title: editedTitle,
    });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  return (
    <>
      <DropIndicator beforeId={uuid} status={status} />
      <motion.div
        layout
        // layoutId={uuid}
        draggable={!isEditing}
        onDragStart={(e:any) => handleDrag(e, { uuid, title, status })}
        className="cursor-grab p-3 rounded border border-baseborder bg-baseform/30 active:cursor-grabbing relative"
      >
        <div className="flex items-center justify-between">
          {isEditing ? (
            <>
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="bg-baseform text-white text-sm rounded px-2 py-1 w-full"
                autoFocus
              />
              <div className="absolute -right-14 top-0 flex flex-col gap-2 bg-baseform">
                <button
                  onClick={handleSave}
                  className="text-xs text-white bg-blue-500 p-1 rounded whitespace-nowrap"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="text-xs text-white bg-gray-500 p-1 rounded whitespace-nowrap"
                >
                  Cancel
                </button>
              </div>
            </>
          ) : (
            <>
              <p className="rounded-lg text-sm text-white">{title}</p>
              <OptionsMenu
                onEdit={handleEdit}
                onDelete={() => {
                  deleteTaskMutation(uuid);
                }}
              />
            </>
          )}
        </div>
      </motion.div>
      <DropIndicator beforeId="-1" status={status} />
    </>
  );
};

const DropIndicator = ({ beforeId, status }: DropProps) => {
  return (
    <div
      data-before-uuid={beforeId}
      data-status={status}
      className=" h-[0.5px] bg-btn/50 opacity-0"
    ></div>
  );
};
