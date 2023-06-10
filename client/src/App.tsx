import React, { useState, useEffect } from "react";
import Searchfield from "./components/SearchField";
import Card from "./components/Card";
import Loader from "./components/Loader";
import { fetchCards, getCardsByName } from "./services/cardService";
import { useDeckManager } from "./hooks/useDeckManager";
import DeckCard from "./components/DeckCard";
import ColorFilter from "./components/ColorFilter";
import { getCardsByColor } from "./services/cardService";
import icon from "../public/PRM_M.png";
import Login from "./components/Login";

export interface CardType {
    id: string;
    imageUris: string;
    name: string;
}

function App() {
    const [loading, setLoading] = useState<boolean>(false);
    const [allCards, setAllCards] = useState<CardType[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [searchedResults, setSearchedResults] = useState<CardType[]>([]);
    const [searchTimeout, setSearchTimeout] = useState<number | undefined>();
    const [page, setPage] = useState(0);
    const [hasNextPage, setHasNextPage] = useState<boolean>(true);
    const [selectedColor, setSelectedColor] = useState<string>("");
    const [isCopied, setIsCopied] = useState<boolean>(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [isLoginDialogOpen, setIsLoginDialogOpen] = useState(false);
    const [isPortrait, setIsPortrait] = useState(
        window.innerHeight > window.innerWidth
    );

    const {
        deck,
        setDeck,
        deckCounts,
        setDeckCounts,
        deckDrop,
        outsideDrop,
        isOver,
    } = useDeckManager(allCards, searchedResults);

    useEffect(() => {
        const loadCards = async () => {
            setLoading(true);
            try {
                let result: CardType[] = [];
                if (selectedColor !== "") {
                    result = await getCardsByColor(selectedColor, page);
                } else {
                    result = await fetchCards(page);
                }
                setAllCards(result);
                setHasNextPage(result.length > 0);
            } catch (error) {
                alert(error);
            } finally {
                setLoading(false);
            }
        };
        loadCards();
    }, [page, selectedColor, searchText]);

    useEffect(() => {
        setPage(0);
    }, [selectedColor, searchText]);

    const handleSearchChange = async (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        // remove timeout for experiment purposes
        // clearTimeout(searchTimeout);
        const searchTextValue = e.target.value;
        setSearchText(searchTextValue);

        if (searchTextValue) {
            const searchResult = await getCardsByName(searchTextValue, page);
            setSearchedResults(searchResult);
        } else {
            setSearchedResults([]);
        }

        /* setSearchTimeout(
            setTimeout(async () => {
                if (searchTextValue) {
                    const searchResult = await getCardsByName(searchTextValue);
                    setSearchedResults(searchResult);
                } else {
                    setSearchedResults([]);
                }
            }, 500)
        ); */
    };

    const addToDeck = (card: CardType) => {
        setDeck((prevDeck) => {
            const updatedDeck = [...prevDeck, card];
            return updatedDeck;
        });
        setDeckCounts((prevCounts) => {
            const updatedCounts = {
                ...prevCounts,
                [card.id]: (prevCounts[card.id] || 0) + 1,
            };
            return updatedCounts;
        });
    };

    const renderCards = (cards: CardType[]) => {
        return cards.map((card) => (
            <Card
                key={card.id}
                imageUris={card.imageUris}
                id={card.id}
                name={card.name}
                addToDeck={addToDeck}
            />
        ));
    };

    useEffect(() => {
        console.log(deck);
    }, [deck]);

    useEffect(() => {
        let resizeTimeout: number | null = null;

        const handleResize = () => {
            if (resizeTimeout !== null) {
                clearTimeout(resizeTimeout);
            }

            resizeTimeout = window.setTimeout(() => {
                setIsPortrait(window.innerHeight > window.innerWidth);
                resizeTimeout = null;
            }, 250);
        };

        window.addEventListener("resize", handleResize);

        return () => {
            if (resizeTimeout !== null) {
                clearTimeout(resizeTimeout);
            }
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    const handleLogin = (username: string, password: string) => {
        // handle the login here
    };

    return (
        <div
            ref={outsideDrop}
            className="h-screen w-screen absolute top-0 left-0"
        >
            <section
                className={`max-w-7xl mx-auto flex ${isPortrait && "hidden"}`}
            >
                <div className="w-4/5">
                    <div className="flex flex-wrap justify-between mt-5 mb-2">
                        <ColorFilter
                            setSelectedColor={setSelectedColor}
                            selectedColor={selectedColor}
                        />
                        <Searchfield
                            labelName="Search cards"
                            type="text"
                            name="text"
                            placeholder="Search cards"
                            value={searchText}
                            handleChange={handleSearchChange}
                        />
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center h-screen">
                            <Loader />
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-3 md:grid-cols-4">
                            {searchText.length > 0 &&
                            searchedResults.length === 0 ? (
                                <div className="text-xl p-4 flex h-screen text-gray-500">
                                    No search results.
                                </div>
                            ) : (
                                renderCards(
                                    searchedResults.length > 0
                                        ? searchedResults
                                        : allCards
                                )
                            )}
                        </div>
                    )}
                    <div className="flex justify-center">
                        <button
                            className={`text-3xl px-4 py-2 mr-2 rounded ${
                                page === 0
                                    ? "bg-gray-200 opacity-50"
                                    : "bg-gray-200"
                            }`}
                            onClick={() => setPage(page - 1)}
                            disabled={page === 0}
                        >
                            ←
                        </button>
                        <button
                            className={`text-3xl px-4 py-2 rounded ${
                                !hasNextPage
                                    ? "bg-gray-200 opacity-50"
                                    : "bg-gray-200"
                            }`}
                            onClick={() => setPage(page + 1)}
                            disabled={!hasNextPage}
                        >
                            →
                        </button>
                    </div>
                </div>
                <div
                    ref={deckDrop}
                    style={{
                        backgroundColor: isOver ? "lightblue" : "white",
                        minWidth: "300px",
                    }}
                    className="w-1/3 border-2 border-gray-300 h-screen max-h-[90vh] ml-4 m-7 flex flex-col rounded-lg"
                >
                    <div className="mt-2 mb-1 flex justify-center items-center px-4">
                        <input
                            type="text"
                            placeholder="New Deck"
                            className="text-3xl outline-none font-bold w-full py-1 px-1 rounded truncate"
                            onBlur={(e) => (e.target.style.fontWeight = "bold")}
                            onFocus={(e) =>
                                (e.target.style.fontWeight = "normal")
                            }
                        />
                    </div>
                    <div className="overflow-y-scroll flex-grow">
                        {Array.from(new Set(deck.map((card) => card.id))).map(
                            (id) => {
                                const card = deck.find(
                                    (card) => card.id === id
                                );
                                return card ? (
                                    <DeckCard
                                        key={card.id}
                                        imageUris={card.imageUris}
                                        id={card.id}
                                        name={card.name}
                                        count={deckCounts[id]}
                                    />
                                ) : null;
                            }
                        )}
                    </div>

                    <div className="mb-2 mt-1 mr-4 ml-4 flex justify-between items-center px-4">
                        <div
                            className="text-xl flex justify-between"
                            style={{ width: "70px" }}
                        >
                            <div className="text-right w-1/2">
                                {deck.length}
                            </div>
                            <div>/</div>
                            <div className="text-left w-1/2">60</div>
                        </div>
                        <button
                            style={{ minWidth: "100px" }}
                            className="bg-gray-200 text-gray-700 font-semibold ml-2 py-1 px-4 rounded"
                            onClick={async () => {
                                let deckText = "";
                                Array.from(
                                    new Set(deck.map((card) => card.id))
                                ).forEach((id) => {
                                    const card = deck.find(
                                        (card) => card.id === id
                                    );
                                    if (card) {
                                        deckText += `${deckCounts[id]} ${card.name}\n`;
                                    }
                                });
                                try {
                                    await navigator.clipboard.writeText(
                                        deckText
                                    );
                                    setIsCopied(true);
                                    setTimeout(() => setIsCopied(false), 3000);
                                    setIsCopied(true);
                                } catch (err) {
                                    console.error("Failed to copy text: ", err);
                                }
                            }}
                        >
                            {isCopied ? "Copied✓" : "Copy"}
                        </button>
                        <button
                            style={{ minWidth: "100px" }}
                            className="bg-gray-700 text-white font-semibold py-1 px-4 rounded"
                            onClick={() => setIsDialogOpen(true)}
                        >
                            Done
                        </button>
                    </div>
                    {isDialogOpen && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60 z-50">
                            <div className="bg-white rounded-lg shadow-xl p-8 max-w-xl mx-auto border-gray-300 transform scale-90 hover:scale-100 transition-transform duration-300">
                                <h3 className="text-3xl font-bold text-gray-700 mb-4 text-center border-b pb-4">
                                    Login required
                                </h3>
                                <p className="text-gray-600 text-lg mb-8 text-center">
                                    You need to log in to save your deck.
                                </p>
                                <div className="grid gap-4">
                                    <button
                                        className="text-2xl bg-blue-500 hover:bg-blue-400 text-white py-2 px-6 rounded-lg shadow transition-colors duration-200"
                                        onClick={() =>
                                            setIsLoginDialogOpen(true)
                                        }
                                    >
                                        Log in
                                    </button>
                                    <button
                                        className="text-2xl bg-gray-400 hover:bg-gray-300 text-white py-2 px-6 rounded-lg shadow transition-colors duration-200"
                                        onClick={() => setIsDialogOpen(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                    {isLoginDialogOpen && (
                        <Login
                            handleLogin={handleLogin}
                            closeDialog={() => setIsLoginDialogOpen(false)}
                        />
                    )}
                </div>
            </section>
            {isPortrait && (
                <div className="h-screen w-screen absolute top-0 left-0 flex items-center justify-center bg-black text-gray-500">
                    <div className="text-center">
                        <img src={icon} />
                        <h1 className="text-6xl font-bold mb-4">MTG Lounge</h1>

                        <h2 className="text-3xl font-semibold mb-4">
                            Please Rotate Your Device
                        </h2>
                        <p className="font-thin">
                            This application is best viewed in landscape mode.
                        </p>
                    </div>
                </div>
            )}
        </div>
    );
}

export default App;
