import { CreateTask } from "@/components/Modals";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { OptionsMenu } from "@/components/Dropdown";
import { Task } from "@/types";
import { useDeleteTask, useGetTasks, useUpdateTask} from "./useTodo";

interface StatusProps {
  title: string;
  cards: Task[];
  status: string;
  setCards: React.Dispatch<React.SetStateAction<Task[]>>;
}

interface CardProps {
  title: string;
  uuid: string;
  status: string;
  handleDrag: (e: React.DragEvent<HTMLDivElement>, card: Task) => void;
  setCards: React.Dispatch<React.SetStateAction<Task[]>>;
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
      <Status title="In Progress" cards={cards} status="In-Progress" setCards={setCards} />
      <Status title="Done" cards={cards} status="Done" setCards={setCards} />
    </div>
  );
};

const Status = ({ title, cards, status, setCards }: StatusProps) => {
  const { updateTaskMutation } = useUpdateTask();
  const [isDragOver, setIsDragOver] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, card: Task) => {
    e.dataTransfer.setData("cardId", card.uuid);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    setIsDragOver(false);
    const cardId = e.dataTransfer.getData("cardId");
    
    updateTaskMutation({
      uuid: cardId,
      status: status,
    });

    let copy = [...cards];
    let cardToTransfer = copy.find((card) => card.uuid === cardId);
    if (!cardToTransfer) return;

    cardToTransfer = { ...cardToTransfer, status };
    copy = copy.filter((card) => card.uuid !== cardId);
    copy.push(cardToTransfer);
    setCards(copy);
  };

  const filteredCards = cards.filter((card) => card.status === status);

  return (
    <div className="w-56 h-fit shrink-0 bg-baseform p-2 rounded-xl border border-baseborder ">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="font-medium text-lg text-white">{title}</h3>
        <span className="px-2 py-1 text-sm text-neutral-400">
          {filteredCards.length}
        </span>
      </div>
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`min-h-[100px] w-full transition-colors ${
          isDragOver ? "bg-neutral-800/20" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((card) => (
          <Card
            key={card.uuid}
            {...card}
            handleDrag={handleDrag}
            setCards={setCards}
          />
        ))}
      </div>
    </div>
  );
};

const Card = ({ title, uuid, status, handleDrag }: CardProps) => {
  const { updateTaskMutation } = useUpdateTask();
  const { deleteTaskMutation } = useDeleteTask();
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleEdit = () => setIsEditing(true);
  
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
    <motion.div
      layout
      draggable={!isEditing}
      onDragStart={(e:any) => handleDrag(e, { uuid, title, status })}
      className="cursor-grab p-3 mb-2 rounded border border-baseborder bg-baseform/30 active:cursor-grabbing relative"
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
              <button onClick={handleSave} className="text-xs text-white bg-blue-500 p-1 rounded">
                Save
              </button>
              <button onClick={handleCancel} className="text-xs text-white bg-gray-500 p-1 rounded">
                Cancel
              </button>
            </div>
          </>
        ) : (
          <>
            <p className="rounded-lg text-sm text-white">{title}</p>
            <OptionsMenu
              onEdit={handleEdit}
              onDelete={() => deleteTaskMutation(uuid)}
            />
          </>
        )}
      </div>
    </motion.div>
  );
};
