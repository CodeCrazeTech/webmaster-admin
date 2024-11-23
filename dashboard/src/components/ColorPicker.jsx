const ColorPicker = ({ color, onColorChange }) => {
    const handleColorChange = (event) => {
      onColorChange(event.target.value);
    };
  
    return (
      <div>
        <label htmlFor="colorInput" className="block mb-1 text-sm font-medium text-gray-900 dark:text-white">
          Primary Color:
        </label>
        <input
          id="colorInput"
          type="text"
          value={color}
          onChange={handleColorChange}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 pl-8 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
          maxLength={7}
        />
        <input
          type="color"
          value={color}
          onChange={handleColorChange}
          className="relative -top-8 -right-2 w-5 h-5 cursor-pointer -mb-12 "
        />
      </div>
    );
  };
  
export default ColorPicker;
  