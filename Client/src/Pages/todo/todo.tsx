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
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>, card: Task) => void;
  setCards: React.Dispatch<React.SetStateAction<Task[]>>;
}

const TaskStats = ({ cards }: { cards: Task[] }) => {
  const totalTasks = cards.length;
  const completedTasks = cards.filter(card => card.status === "Done").length;
  const inProgressTasks = cards.filter(card => card.status === "In-Progress").length;
  const todoTasks = cards.filter(card => card.status === "Todo").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-baseform p-4 rounded-lg border border-baseborder">
        <h3 className="text-sm text-neutral-400">Total Tasks</h3>
        <p className="text-2xl font-semibold text-white mt-1">{totalTasks}</p>
      </div>
      <div className="bg-baseform p-4 rounded-lg border border-baseborder">
        <h3 className="text-sm text-neutral-400">Completed</h3>
        <p className="text-2xl font-semibold text-green-500 mt-1">{completedTasks}</p>
      </div>
      <div className="bg-baseform p-4 rounded-lg border border-baseborder">
        <h3 className="text-sm text-neutral-400">In Progress</h3>
        <p className="text-2xl font-semibold text-yellow-500 mt-1">{inProgressTasks}</p>
      </div>
      <div className="bg-baseform p-4 rounded-lg border border-baseborder">
        <h3 className="text-sm text-neutral-400">To Do</h3>
        <p className="text-2xl font-semibold text-blue-500 mt-1">{todoTasks}</p>
      </div>
    </div>
  );
};

export const Todo = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="p-4 md:p-6 flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">Task Board</h1>
            <p className="text-neutral-400 text-sm mt-1">Manage and organize your tasks</p>
          </div>
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
    <div className="flex flex-col h-full w-full p-4 md:p-12">
      <TaskStats cards={cards} />
      <div className="flex flex-col md:flex-row w-full gap-3 overflow-x-auto">
        <Status title="To Do" cards={cards} status="Todo" setCards={setCards} />
        <Status title="In Progress" cards={cards} status="In-Progress" setCards={setCards} />
        <Status title="Done" cards={cards} status="Done" setCards={setCards} />
      </div>
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

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, card: Task) => {
    const touch = e.touches[0];
    const element = e.currentTarget as HTMLDivElement;
    
    // Calculate offset from the viewport edges instead of element edges
    const offsetX = touch.clientX - element.getBoundingClientRect().left;
    const offsetY = touch.clientY - element.getBoundingClientRect().top;
    const originalWidth = element.getBoundingClientRect().width;
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent scrolling while dragging
      const touch = e.touches[0];
      
      element.style.position = 'fixed'; // Changed to fixed positioning
      element.style.width = `${originalWidth}px`;
      element.style.zIndex = '1000';
      // Apply the offset to keep the element aligned with the finger
      element.style.left = `${touch.clientX - offsetX}px`;
      element.style.top = `${touch.clientY - offsetY}px`;
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      // Reset styles
      element.style.position = '';
      element.style.width = '';
      element.style.zIndex = '';
      element.style.left = '';
      element.style.top = '';
      
      const touch = e.changedTouches[0];
      const dropTarget = document.elementFromPoint(touch.clientX, touch.clientY);
      const statusColumn = dropTarget?.closest('[data-status]');
      
      if (statusColumn) {
        const newStatus = statusColumn.getAttribute('data-status');
        if (newStatus && newStatus !== card.status) {
          updateTaskMutation({
            uuid: card.uuid,
            status: newStatus,
          });

          let copy = [...cards];
          let cardToTransfer = { ...card, status: newStatus };
          copy = copy.filter((c) => c.uuid !== card.uuid);
          copy.push(cardToTransfer);
          setCards(copy);
        }
      }
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false }); // Added passive: false
    document.addEventListener('touchend', handleTouchEnd);
  };

  const filteredCards = cards.filter((card) => card.status === status);

  return (
    <div 
      className="min-w-[200px] md:min-w-[180px] max-w-full md:w-56 h-fit shrink-0 bg-baseform p-2 rounded-xl border border-baseborder"
      data-status={status}
    >
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
        data-status={status}
        className={`min-h-[60px] w-full transition-colors ${
          isDragOver ? "bg-neutral-800/20" : "bg-neutral-800/0"
        }`}
      >
        {filteredCards.map((card) => (
          <Card
            key={card.uuid}
            {...card}
            handleDrag={handleDrag}
            handleTouchStart={handleTouchStart}
            setCards={setCards}
          />
        ))}
      </div>
    </div>
  );
};

const Card = ({ title, uuid, status, handleDrag, handleTouchStart, setCards }: CardProps) => {
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
      onTouchStart={(e) => handleTouchStart(e, { uuid, title, status })}
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
