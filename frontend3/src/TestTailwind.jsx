import React from 'react';

const TestTailwind = () => {
  return (
    <div className="bg-bgLight min-h-screen p-8">
      {/* Header Test */}
      <h1 className="text-4xl text-primary font-bold mb-4">Tailwind Test Page</h1>
      <p className="text-textSoft mb-6">This is a test of custom colors and the Inter font.</p>

      {/* Button Tests */}
      <button className="bg-accent text-white px-4 py-2 rounded hover:bg-orange-600 mr-4">Accent Button (Orange-Brown)</button>
      <button className="bg-secondary text-white px-4 py-2 rounded hover:bg-blue-600">Secondary Button (Sky Blue)</button>

      {/* Flex and Grid Tests */}
      <div className="mt-8 flex gap-4">
        <div className="w-1/3 bg-gray-200 p-4 rounded">Flex Item 1</div>
        <div className="w-1/3 bg-gray-300 p-4 rounded">Flex Item 2</div>
        <div className="w-1/3 bg-gray-400 p-4 rounded">Flex Item 3</div>
      </div>

      <div className="mt-8 grid grid-cols-3 gap-4">
        <div className="bg-gray-200 p-4 rounded">Grid Item 1</div>
        <div className="bg-gray-300 p-4 rounded">Grid Item 2</div>
        <div className="bg-gray-400 p-4 rounded">Grid Item 3</div>
      </div>

      {/* Responsive Test */}
      <div className="mt-8 text-center">
        <p className="text-lg md:text-2xl lg:text-3xl text-textDark">Responsive Text (grows on md and lg screens)</p>
      </div>
    </div>
  );
};

export default TestTailwind;