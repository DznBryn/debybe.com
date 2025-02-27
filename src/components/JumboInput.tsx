import React from 'react';
import { useInputContext } from './InputContext';

const JumboInput: React.FC = () => {
    const { inputValue, setInputValue } = useInputContext();

    return (
			<div className='flex flex-col items-center w-full max-w-xl px-4'>
				<input
					type='text'
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					className='text-3xl text-center p-4 border-b-red-950 border-b-2 w-full focus:outline-none focus:border-b-2 focus:border-gray-600'
					placeholder='Type something...'
				/>
				{/* <p className="mt-4 text-xl">Current Value: {inputValue}</p> */}
			</div>
		);
};

export default JumboInput; 