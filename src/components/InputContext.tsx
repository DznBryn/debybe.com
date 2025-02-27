import React, { createContext, useContext, useState } from 'react';

interface InputContextType {
    inputValue: string;
    setInputValue: (value: string) => void;
}

const InputContext = createContext<InputContextType | undefined>(undefined);

export const InputProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [inputValue, setInputValue] = useState('');

    return (
        <InputContext.Provider value={{ inputValue, setInputValue }}>
            {children}
        </InputContext.Provider>
    );
};

export const useInputContext = () => {
    const context = useContext(InputContext);
    if (!context) {
        throw new Error('useInputContext must be used within an InputProvider');
    }
    return context;
}; 