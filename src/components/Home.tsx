import React from 'react';
import AnimatedText from './AnimatedText';
import Navbar from './Navbar';
import JumboInput from './JumboInput';

const Home: React.FC = () => {
    return (
        <div className="flex flex-col gap-10 items-center justify-center h-screen bg-burgundy">
            <AnimatedText content='Create & Cultivate' />
            <JumboInput />
            <Navbar />
        </div>
    );
};

export default Home;
