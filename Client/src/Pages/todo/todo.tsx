import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CreateTask } from "@/components/Modals";
import { motion } from "framer-motion";
import { useState } from "react";
import { OptionsMenu } from "@/components/Dropdown";

interface ColumnProps {
  title: string;
  cards: Card[];
  column: string;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
}
interface DropProps {
  beforeId: string;
  column: string;
}

interface CardProps {
  title: string;
  id: string;
  column: string;
  handleDrag: (e: React.DragEvent<HTMLDivElement>, card: Card) => void;
  setCards: React.Dispatch<React.SetStateAction<Card[]>>;
}

interface DragEvent {
  clientY: number;
}

interface IndicatorType {
  offset: number;
  element: HTMLElement;
}

interface Card {
  id: string;
  title: string;
  column: string;
}

export const Todo = () => {
  return (
    <div className="w-full h-full flex flex-col">
      <header className="flex justify-between px-[20px] py-6 items-center border-b border-baseborder">
        <div className="flex-1" />
        <div className="flex items-center gap-4">
          <span className="font-medium text-lg text-white">Konan</span>
          <Avatar>
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
      </header>

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
  const [cards, setCards] = useState<Card[]>(DEFAULT_CARDS);
  return (
    <div className="flex h-full w-full gap-3 overflow-scroll p-12">
      <Column title="To Do" cards={cards} column="todo" setCards={setCards} />

      <Column
        title="In Progress"
        cards={cards}
        column="inProgress"
        setCards={setCards}
      />

      <Column title="Done" cards={cards} column="done" setCards={setCards} />
    </div>
  );
};

const Column = ({ title, cards, column, setCards }: ColumnProps) => {
  const [active, setActive] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLDivElement>, card: Card) => {
    e.dataTransfer.setData("cardId", card.id);
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
    return Array.from(document.querySelectorAll(`[data-column="${column}"]`));
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

    if (filteredCards.length === 0) {
      let copy = [...cards];
      let cardToTransfer = copy.find((card) => card.id === cardId);
      if (!cardToTransfer) return;

      cardToTransfer = { ...cardToTransfer, column };
      copy = copy.filter((card) => card.id !== cardId);
      copy.push(cardToTransfer);
      setCards(copy);
      return;
    }

    const indicators = getIndicators();
    const nearest = getNearestIndicator(e, indicators);
    const beforeId = nearest.element.dataset.beforeId || "-1";

    if (beforeId !== cardId) {
      let copy = [...cards];
      let cardToTransfer = copy.find((card) => card.id === cardId);
      if (!cardToTransfer) return;

      cardToTransfer = { ...cardToTransfer, column };
      copy = copy.filter((card) => card.id !== cardId);

      const moveToBack = beforeId === "-1";

      if (moveToBack) {
        copy.push(cardToTransfer);
      } else {
        const beforeIndex = copy.findIndex((card) => card.id === beforeId);
        copy.splice(beforeIndex + 1, 0, cardToTransfer);
      }

      setCards(copy);
    }
  };

  const filteredCards = cards.filter((card: Card) => card.column === column);

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
          <DropIndicator beforeId="-1" column={column} />
        ) : (
          filteredCards.map((card) => (
            <Card
              key={card.id}
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

const Card = ({ title, id, column, handleDrag, setCards }: CardProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(title);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setCards((prevCards: Card[]) =>
      prevCards.map((card) =>
        card.id === id ? { ...card, title: editedTitle } : card,
      ),
    );
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedTitle(title);
    setIsEditing(false);
  };

  return (
    <>
      <DropIndicator beforeId={id} column={column} />
      <motion.div
        layout
        layoutId={id}
        draggable={!isEditing}
        onDragStart={(e: any) => handleDrag(e, { id, title, column })}
        className="cursor-grab p-3 rounded border border-baseborder bg-baseform/30 active:cursor-grabbing"
      >
        <div className="flex items-center justify-between">
          {isEditing ? (
            <div className="flex items-center gap-2 flex-grow">
              <input
                type="text"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
                className="bg-baseform text-white text-sm rounded px-2 py-1 flex-grow"
                autoFocus
              />
              <button
                onClick={handleSave}
                className="text-xs text-white bg-blue-500 px-2 py-1 rounded"
              >
                Save
              </button>
              <button
                onClick={handleCancel}
                className="text-xs text-white bg-gray-500 px-2 py-1 rounded"
              >
                Cancel
              </button>
            </div>
          ) : (
            <>
              <p className="rounded-lg text-sm text-white">{title}</p>
              <OptionsMenu
                onEdit={handleEdit}
                onDelete={() => {
                  /* implement delete handler */
                }}
              />
            </>
          )}
        </div>
      </motion.div>
      <DropIndicator beforeId="-1" column={column} />
    </>
  );
};

const DropIndicator = ({ beforeId, column }: DropProps) => {
  return (
    <div
      data-before-id={beforeId}
      data-column={column}
      className=" h-[0.5px] bg-btn/50 opacity-0"
    ></div>
  );
};

const DEFAULT_CARDS: Card[] = [
  // TODO
  { title: "Look into render bug in dashboard", id: "1", column: "todo" },
  { title: "SOX compliance checklist", id: "2", column: "todo" },
  {
    title: "Research DB options for new microservice",
    id: "3",
    column: "todo",
  },

  {
    title: "Update user authentication flow",
    id: "6",
    column: "inProgress",
  },
  {
    title: "Implement new API endpoints",
    id: "7",
    column: "inProgress",
  },

  {
    title: "Refactor context providers to use Zustand",
    id: "4",
    column: "done",
  },
  {
    title: "Set up DD dashboards for Lambda listener",
    id: "5",
    column: "done",
  },
];
