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

    const handleMouseEnter = () => {
        setShowCard(true);
    };

    const handleMouseLeave = () => {
        setShowCard(false);
    };

    return (
        <div
            ref={drag}
            style={{ opacity: isDragging ? 0.5 : 1 }}
            className="flex flex-col items-center p-0.5"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
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
            {showCard && <img src={imageUris} alt={name} />}
        </div>
    );
};

export default DeckCard;
