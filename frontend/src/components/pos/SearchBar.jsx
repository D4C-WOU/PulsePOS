import { FiSearch, FiX } from "react-icons/fi";

const SearchBar = ({
  value,
  onChange,
  placeholder = "Search products...",
}) => {
  return (
    <div
      className="
        relative
        w-full
      "
    >
      {/* Search Icon */}
      <FiSearch
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-slate-500
          text-lg
        "
      />

      {/* Input */}
      <input
        type="text"
        value={value}
        onChange={(e) =>
          onChange(e.target.value)
        }
        placeholder={placeholder}
        className="
          w-full
          bg-[#111827]
          border border-slate-800
          rounded-2xl
          py-3
          pl-12
          pr-12
          text-white
          placeholder:text-slate-500
          outline-none
          focus:border-orange-500
          transition
        "
      />

      {/* Clear Button */}
      {value && (
        <button
          onClick={() => onChange("")}
          className="
            absolute
            right-4
            top-1/2
            -translate-y-1/2
            text-slate-500
            hover:text-white
            transition
          "
        >
          <FiX size={18} />
        </button>
      )}
    </div>
  );
};

export default SearchBar;