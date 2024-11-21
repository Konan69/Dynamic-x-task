import { CreateTask } from "@/components/Modals";
import { motion } from "framer-motion";
import { useState } from "react";
import { OptionsMenu } from "@/components/Dropdown";
import { Task } from "@/types";
import { useDeleteTask, useGetTasks, useUpdateTask} from "./useTodo";
import { useQueryClient } from '@tanstack/react-query';

interface StatusProps {
  title: string;
  cards: Task[];
  status: string;
}

interface CardProps {
  title: string;
  uuid: string;
  status: string;
  handleDrag: (e: React.DragEvent<HTMLDivElement>, card: Task) => void;
  handleTouchStart: (e: React.TouchEvent<HTMLDivElement>, card: Task) => void;
}

const TaskStats = ({ cards }: { cards: Task[] }) => {
  const totalTasks = cards.length;
  const completedTasks = cards.filter(card => card.status === "Done").length;
  const inProgressTasks = cards.filter(card => card.status === "In-Progress").length;
  const todoTasks = cards.filter(card => card.status === "Todo").length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      <div className="bg-baseform p-4 rounded-lg border border-baseborder" data-testid="stats-total">
        <h3 className="text-sm text-neutral-400">Total Tasks</h3>
        <p className="text-2xl font-semibold text-white mt-1">{totalTasks}</p>
      </div>
      <div className="bg-baseform p-4 rounded-lg border border-baseborder" data-testid="stats-completed">
        <h3 className="text-sm text-neutral-400">Completed</h3>
        <p className="text-2xl font-semibold text-green-500 mt-1">{completedTasks}</p>
      </div>
      <div className="bg-baseform p-4 rounded-lg border border-baseborder" data-testid="stats-in-progress">
        <h3 className="text-sm text-neutral-400">In Progress</h3>
        <p className="text-2xl font-semibold text-yellow-500 mt-1">{inProgressTasks}</p>
      </div>
      <div className="bg-baseform p-4 rounded-lg border border-baseborder" data-testid="stats-todo">
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
  const { data: tasks, isLoading, isError, error } = useGetTasks();

  if (isLoading) {
    return <div className="p-12">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="p-12 text-center">
        <div className="text-red-500 font-medium">Failed to get tasks</div>
        <div className="text-neutral-400 text-sm mt-2">
          {error instanceof Error ? error.message : 'Please try again later'}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full w-full p-4 md:p-12">
      <TaskStats cards={tasks} />
      <div className="flex flex-col md:flex-row w-full gap-3 overflow-x-auto">
        <Status title="To Do" cards={tasks} status="Todo" />
        <Status title="In Progress" cards={tasks} status="In-Progress" />
        <Status title="Done" cards={tasks} status="Done" />
      </div>
    </div>
  );
};

const Status = ({ title, cards, status }: Omit<StatusProps, 'setCards'>) => {
  const queryClient = useQueryClient();
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
    
    // Optimistically update the UI
    queryClient.setQueryData(['tasks'], (oldData: Task[]) => {
      return oldData.map(task => 
        task.uuid === cardId ? { ...task, status } : task
      );
    });

    // Send update to server
    updateTaskMutation({
      uuid: cardId,
      status: status,
    });
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>, card: Task) => {
    const touch = e.touches[0];
    const element = e.currentTarget as HTMLDivElement;
    
    const offsetX = touch.clientX - element.getBoundingClientRect().left;
    const offsetY = touch.clientY - element.getBoundingClientRect().top;
    const originalWidth = element.getBoundingClientRect().width;
    
    let scrollInterval: NodeJS.Timeout | null = null;
    
    const handleScroll = (clientY: number) => {
      const scrollThreshold = 60; // pixels from top/bottom to trigger scroll
      const scrollSpeed = 8; // pixels per interval
      const viewportHeight = window.innerHeight;
      
      // Clear any existing scroll interval
      if (scrollInterval) clearInterval(scrollInterval);
      
      if (clientY < scrollThreshold) {
        // Scroll up when near top
        scrollInterval = setInterval(() => {
          window.scrollBy(0, -scrollSpeed);
        }, 16);
      } else if (clientY > viewportHeight - scrollThreshold) {
        // Scroll down when near bottom
        scrollInterval = setInterval(() => {
          window.scrollBy(0, scrollSpeed);
        }, 16);
      }
    };
    
    const handleTouchMove = (e: TouchEvent) => {
      e.preventDefault(); // Prevent default scrolling
      const touch = e.touches[0];
      
      element.style.position = 'fixed';
      element.style.width = `${originalWidth}px`;
      element.style.zIndex = '1000';
      element.style.left = `${touch.clientX - offsetX}px`;
      element.style.top = `${touch.clientY - offsetY}px`;
      
      // Check if we need to scroll
      handleScroll(touch.clientY);
    };
    
    const handleTouchEnd = (e: TouchEvent) => {
      if (scrollInterval) {
        clearInterval(scrollInterval);
      }
      
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
          // Optimistically update the UI
          queryClient.setQueryData(['tasks'], (oldData: Task[]) => {
            return oldData.map(task => 
              task.uuid === card.uuid ? { ...task, status: newStatus } : task
            );
          });

          // Send update to server
          updateTaskMutation({
            uuid: card.uuid,
            status: newStatus,
          });
        }
      }
      
      document.removeEventListener('touchmove', handleTouchMove);
      document.removeEventListener('touchend', handleTouchEnd);
    };
    
    document.addEventListener('touchmove', handleTouchMove, { passive: false }); // Keep passive: false to allow preventDefault
    document.addEventListener('touchend', handleTouchEnd);
  };

  const filteredCards = cards.filter((card) => card.status === status);

  return (
    <div 
      className="min-w-[200px] md:min-w-[180px] max-w-full md:w-56 h-fit shrink-0 bg-baseform p-2 rounded-xl border border-baseborder"
      data-status={status}
      data-testid={`column-${status}`}
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
          />
        ))}
      </div>
    </div>
  );
};

const Card = ({ title, uuid, status, handleDrag, handleTouchStart, }: CardProps) => {
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
            <div className="absolute right-3 top-3 flex flex-col gap-2 bg-baseform rounded-md border border-baseborder shadow-lg p-2">
              <button onClick={handleSave} className="text-xs text-white bg-blue-500 px-2 py-1 rounded hover:bg-blue-600">
                Save
              </button>
              <button onClick={handleCancel} className="text-xs text-white bg-gray-500 px-2 py-1 rounded hover:bg-gray-600">
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
