import { useDrag } from "react-dnd";
import { useState } from "react";

interface DeckCardProps {
    id: string;
    imageUris: string;
    name: string;
    count: number;
}

const DeckCard: React.FC<DeckCardProps> = ({ id, imageUris, name, count }) => {
    const [{ isDragging }, drag] = useDrag(() => ({
        type: "deckCard",
        item: { id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging(),
        }),
    }));

    const [showCard, setShowCard] = useState(false);
    const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 });

    const handleMouseEnter = (e: React.MouseEvent) => {
        const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setCardPosition({ top: rect.top, left: rect.left - 350 });
        setShowCard(true);
    };

    const handleMouseLeave = () => {
        setShowCard(false);
    };

    const handleMouseDown = () => {
        setShowCard(false);
    };

    return (
        <div
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className="relative flex flex-col items-center p-0.5"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseDown={handleMouseDown}
        >
            <div className="bg-gray-200 rounded flex w-full">
                <div className="flex justify-between items-center w-full">
                    <p className="text-gray-700 m-2 font-black flex-grow truncate">
                        {name}
                    </p>
                    <span className="text-gray-700 m-2 mr-8 flex-shrink-0">
                        {count > 1 ? count : ""}
                    </span>
                </div>
            </div>
            {showCard && (
                <div 
                style={{
                    position: "fixed", 
                    top: cardPosition.top, 
                    left: cardPosition.left, 
                    zIndex: 1,
                    width: '350px',
                    height: '350px'
                }}
                >
                    <img src={imageUris} alt={name} className="rounded-lg"/>
                </div>
            )}
        </div>
    );
};

export default DeckCard;
